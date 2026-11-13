# Terminalis packages

Signed package repositories for apps by terminalis, listed at [terminalis.github.io](https://terminalis.github.io/).

## Flatpak

```sh
flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak remote-add --user --if-not-exists terminalis https://terminalis.github.io/packages/flatpak/terminalis.flatpakrepo
```

Signing key `0E01 472A 68F3 E4CD 6D4A 88CC F5D5 209C FD7E BAD0`.

## F-Droid

```text
https://terminalis.github.io/packages/fdroid/repo?fingerprint=E172E436AAECD5F656AFEB2D40F3011C111C114AB1A60507672CEA5ACBDC17D2
```

In Obtainium, use the "F-Droid Third Party Repo" source with `https://terminalis.github.io/packages/fdroid/repo` and
the app's ID.

## How it works

`.github/workflows/publish.yml` runs after each app's release and on every push to `main`. It rebuilds both
repositories from each app's latest GitHub Release, signs them, and publishes them under
`https://terminalis.github.io/packages/`, with the page in `site/` at the root. The apps are the repos in
`FLATPAK_APPS` and the files in `fdroid/metadata/`; adding one adds it to its repository and to the page.
