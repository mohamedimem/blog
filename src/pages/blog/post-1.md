---
layout: "../../layouts/BlogPostLayout.astro"
title: A Post about Important Items Of Life
date: 2022-11-20
author: Darnell McClure
image: {
  src: "/images/post-1.jpg",
  alt: "A picture of a coder",
}
description: Have you ever wondered what the most important items of life are? Well, wonder no more!
draft: false
category: Reference Docs
---
 

# Flutter App Architecture with Riverpod: An Introduction
When building complex apps, choosing the correct **app architecture** is crucial, as it allows you to **structure** your code and support your codebase as it grows.

Good architecture should help you **handle complexity without getting in the way**. But it's not easy to get it right:

*   “Not enough” architecture leads to poorly organized code that lacks clear conventions
*   “Too much” of it leads to over-engineering, making it hard to make even simple changes

In practice, things can be quite nuanced, and it can be tricky to get the right balance.

So in this article, I’m sharing a new reference architecture that you can use to:

*   **ensure a good separation of concerns** between your **UI code** (1), your **business logic** (2), and your **data access logic** (3)
*   **easily fetch and cache data** with minimal boilerplate code
*   **perform data mutations** while handling the UI states (data, loading, error) in a predictable way
*   **write testable code** and mock dependencies in a breeze

This architecture leans heavily on the Riverpod package, making the most of its **reactive caching** and **data-binding** features.

**But why do we need a reference architecture in the first place?**

[Riverpod is not very opinionated](#riverpod-is-not-very-opinionated)
---------------------------------------------------------------------

Riverpod is great. I use it in all my apps and [have written many tutorials about it](https://codewithandrea.com/tags/riverpod/) - but the official docs don’t offer any guidance about how to structure your code.

As a result, you’re on your own when it comes to making important decisions such as:

*   How to separate your UI code from your business logic and the data access logic?
*   Which classes should you write? What are their responsibilities? And how do they communicate with each other?
*   How do you make your code more scalable - so that different team members can work on multiple features independently?
*   How should you organize your files?
*   What about error handling? Where should it take place, and how should errors propagate to the UI?
*   Which providers should you use, and where should they be declared?

These decisions matter. And if you leave them to chance, you’ll end up with performance problems, bugs, and ongoing maintenance issues that will affect your development speed.

And this is where having a very opinionated app architecture makes all the difference. 👇

[Riverpod + Reference App Architecture = 👌](#riverpod-+-reference-app-architecture-=-👌)
-----------------------------------------------------------------------------------------

While building Flutter apps of varying complexity, I've experimented a lot with app architecture and developed a deep understanding of what works well and what doesn't.

The result is a **reference architecture** that I've used in all my latest projects.

> For lack of a better name, I'll call this Riverpod Architecture - though keep in mind that this is just my take on it and not an "official" architecture endorsed by Remi Rousselet (the author of Riverpod).

This architecture comprises four layers (**data**, **domain**, **application**, and **presentation**).

Here's a preview:

_App architecture using data, domain, application, and presentation layers. Arrows show the dependencies between layers._

Each of these layers has its own responsibility, and there's a **clear contract** for how communication happens across boundaries.

So let’s take a closer look at each layer. 👇

> Since there is much to cover, this article only includes a conceptual, high-level overview of the four layers. Below you’ll find links to separate articles covering each layer in more detail.

### [The Presentation Layer](#the-presentation-layer)

This is often called the UI layer. And [this guide about Android app architecture](https://developer.android.com/topic/architecture/ui-layer) describes it well:

> The role of the UI is to display the application data on the screen and also to serve as the primary point of user interaction. Whenever the data changes, either due to user interaction (like pressing a button) or external input (like a network response), the UI should update to reflect those changes. _Effectively, the UI is a visual representation of the application state as retrieved from the data layer._

In our architecture, the presentation layer contains two main types of components:

*   **Widgets**, which are a representation of the data to be displayed on screen.
*   **Controllers**, which perform asynchronous data mutations and manage the widget state.

_Flutter App Architecture: the presentation layer. Arrows show the dependencies between layers._

The controllers themselves are usually represented as [`AsyncNotifier` subclasses](https://codewithandrea.com/articles/flutter-riverpod-async-notifier/), and I’ve covered them in detail in this separate article:

*   [Flutter App Architecture: The Presentation Layer](https://codewithandrea.com/articles/flutter-presentation-layer/)

### [The Domain Layer](#the-domain-layer)

The primary role of the domain layer is to define **application-specific model classes** that represent the data that comes from the data layer.

**Model classes are simple data classes** and have the following requirements:

*   They are always immutable.
*   They contain serialization logic (such as `fromJson` and `toJson` methods).
*   They implement the `==` operator and the `hashCode` method.

Using an eCommerce application as an example, we could identify the following entities and represent them as model classes:

_eCommerce app: entities and their relationships_

Model classes may depend on other model classes (e.g. a `ShoppingCart` class may contain a list of `Products`). But they don’t know where to get the data from and have no other dependencies. As such, model classes can be imported and used everywhere else in your app (widgets, controllers, services, repositories).

> To more easily define the properties and methods in your data classes, you can use packages such as [Freezed](https://pub.dev/packages/freezed) and [Equatable](https://pub.dev/packages/equatable), or tools such as the [Dart Data Class Generator](https://marketplace.visualstudio.com/items?itemName=hzgood.dart-data-class-generator).

To learn more about the domain layer and model classes, read this:

*   [Flutter App Architecture: The Domain Model](https://codewithandrea.com/articles/flutter-app-architecture-domain-model/)

### [The Data Layer](#the-data-layer)

The data layer contains three types of classes:

*   **Data Sources**, which are 3rd party APIs used to communicate with the outside world (e.g. a remote database, a REST API client, a push notification system, a Bluetooth interface).
*   **Data Transfer Objects** (or DTOs), which are returned by the data sources. DTOs are often represented as unstructured data (such as JSON) when sending data over the network
*   **Repositories**, which are used to access DTOs from various sources, such as a backend API, and make them available as type-safe **model classes** (a.k.a. entities) to the rest of the app.

_Flutter App Architecture: the data layer. Arrows show the dependencies between layers._

Note that both data sources and DTOs are **external dependencies.** To use them, you import packages into your app and **consume** their APIs.

On the other hand, repositories are classes that live in your codebase, so it's your job to implement them and **design** their API.

> If your Flutter app talks to a local or remote database, that database is the [**single source of truth**](https://en.wikipedia.org/wiki/Single_source_of_truth) for your data. As far as your app is concerned, **repositories are the gateway** to that source of truth. This app architecture accounts for this by implementing an **unidirectional data flow** from the data layer all the way into the UI.

To learn more about repositories and the data layer, read this:

*   [Flutter App Architecture: The Repository Pattern](https://codewithandrea.com/articles/flutter-repository-pattern/)

### [The Application Layer](#the-application-layer)

When building complex apps, we may find ourselves writing logic that:

*   depends on multiple data sources or repositories
*   needs to be used (shared) by more than one widget

In this case, it's tempting to put that logic inside the classes we already have (controllers or repositories).

But this leads to poor separation of concerns, making our code harder to read, maintain, and test.

To address this, we can introduce a new, **optional** layer called the application layer. Inside it, we can add service classes, which act as the middle-man between the controllers (which only manage the widget state) and the repositories (which talk to different data sources).

Here’s an example showing a `CartService` class that mediates between controllers and repositories:

_A shopping cart example feature showing how to use a service class to mediate between controllers and repositories_

To learn more about the application layer, read this:

*   [Flutter App Architecture: The Application Layer](https://codewithandrea.com/articles/flutter-app-architecture-application-layer/)

[Wrap Up](#wrap-up)
-------------------

So far, we’ve learned about the four main layers in my Riverpod architecture and the classes inside them (widgets, controllers, models, services, repositories, data sources).

**But how do all these different classes interact with each other**, and how can we use them to build **working features** in our apps?

This is where Riverpod and all its useful providers come in. And when building mobile apps, most of the work we do boils down to two things:

*   Fetch data and show it in the UI
*   Perform data mutations in response to input events

To learn more about this, you can read this follow-up article:

*   [How to Fetch Data and Perform Data Mutations with the Riverpod Architecture](https://codewithandrea.com/articles/data-mutations-riverpod/)

### [Where to go from here?](#where-to-go-from-here?)

If you need help choosing the most appropriate project structure for your Flutter apps, I’ve got you covered:

*   [Flutter Project Structure: Feature-first or Layer-first?](https://codewithandrea.com/articles/flutter-project-structure/)

If you want to explore other popular architectures (such as MVP, MVVM, or Clean Architecture) and understand how they compare with the architecture proposed here, read this:

*   [A Comparison of Popular Flutter App Architectures](https://codewithandrea.com/articles/comparison-flutter-app-architectures/)

To learn more about each of the four layers in the Riverpod architecture, read the other articles in this series:

*   [Flutter App Architecture: The Repository Pattern](https://codewithandrea.com/articles/flutter-repository-pattern/)
*   [Flutter App Architecture: The Domain Model](https://codewithandrea.com/articles/flutter-app-architecture-domain-model/)
*   [Flutter App Architecture: The Presentation Layer](https://codewithandrea.com/articles/flutter-presentation-layer/)
*   [Flutter App Architecture: The Application Layer](https://codewithandrea.com/articles/flutter-app-architecture-application-layer/)

And if you want to go deeper still, you can check out my Flutter Foundations course, where I guide you through the implementation of a complex eCommerce app using the app architecture we've covered here, along with many useful techniques you won't find elsewhere. 👇

[Flutter Foundations Course Now Available](#flutter-foundations-course-now-available)
-------------------------------------------------------------------------------------

I launched a brand new course that covers Flutter app architecture in great depth, along with other important topics like state management, navigation & routing, testing, and much more:
