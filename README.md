# Terminalis packages

Signed package repositories for apps by terminalis, listed at [terminalis.github.io](https://terminalis.github.io/).

## Install

### Flatpak

Envarsa:

```sh
flatpak install --user https://terminalis.github.io/packages/flatpak/envarsa.flatpakref
```

Gittin:

```sh
flatpak install --user https://terminalis.github.io/packages/flatpak/gittin.flatpakref
```

New versions then arrive through `flatpak update` and software centers such as GNOME Software and KDE Discover.

To add the Flatpak repository without installing an app, so software centers list every app in it:

```sh
flatpak remote-add --user --if-not-exists terminalis https://terminalis.github.io/packages/flatpak/terminalis.flatpakrepo
```

The apps use runtimes from Flathub, so that needs the Flathub remote too. An app's `.flatpakref` adds it by
itself.

### Android

Mach Launcher is in an F-Droid repository. Add it to F-Droid, Droid-ify or Neo Store with this address, which
includes the repository's fingerprint:

```text
https://terminalis.github.io/packages/fdroid/repo?fingerprint=E172E436AAECD5F656AFEB2D40F3011C111C114AB1A60507672CEA5ACBDC17D2
```

The client then lists every app in the repository and installs their updates.

In Obtainium, add an app with the "F-Droid Third Party Repo" source, the address
`https://terminalis.github.io/packages/fdroid/repo` and the app's ID: `io.github.terminalis.machlauncher`
for Mach Launcher.

## How it works

`.github/workflows/publish.yml` publishes the whole site. After each app's release, it builds the signed
repositories from the apps' latest GitHub Releases and publishes them at
`https://terminalis.github.io/packages/<folder>`, one folder per package format here; the F-Droid repository
is at `fdroid/repo`. Each Android app has a file in `fdroid/metadata/`, and its listing comes from the
`fastlane/` folder in the app's repository at the release's tag. The page in `site/` is published at the root,
with its list of apps generated from the same apps.
