# The Backing Track App

A practice app for improvisers. Pick a tune, a key and a tempo, and a generated
rhythm section (piano, walking bass and drums) plays along and follows the chord
changes. Nothing is pre-recorded: the comping and bass lines are improvised fresh
on every chorus, using the Web Audio API.

## Features

- Twelve built-in tunes: medium blues, minor blues, rhythm changes, Cherokee, Giant
  Steps, After You've Gone, In the Still of the Night, major and minor
  ii–V–I workouts, a bossa loop, a ballad and a modal vamp
- Type your own changes (`Dm7 G7 | Cmaj7 | Am7 D7 | ...`). `%` repeats the last bar and
  slash chords such as `F6/A` work.
- Any of the 12 keys, tempo from 40 to 260 bpm
- Chart names for concert, B♭, E♭ and F instruments (the band always plays in concert key)
- Loop any section of the form: drag across bars, or use **Pick a loop**
- Swing, bossa and ballad feels, with a swing amount control
- Two sound engines: the built-in synth, or real instrument samples from a SoundFont
  file you load (see Sounds below)
- Band mixer with volume and mute for piano, bass and drums
- One bar count-in, and a set number of choruses if you want the tune to end by itself
- Six looks to choose from: System (follows light or dark), Midnight, Smoky club,
  Forest, Chart paper and High contrast

Keyboard: **Space** starts and stops, **Up / Down** changes the tempo by 2 bpm.

## Run it

### Fastest: open the file

Open `app/index.html` in Chrome, Edge, Firefox or Safari. No install needed.
The fonts load from Google Fonts when you are online and fall back to your system
fonts when you are not.

### As a desktop app

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm start
```

### Build an installer

```bash
npm run dist        # builds for the system you are on
npm run dist:win    # Windows installer and portable .exe
```

Files appear in `dist/`.

## Sounds

The band has two sound engines. **Classic synth** is built in and is the default.
**SoundFont** plays real instrument samples from a file you load.

1. In the **Sound** panel choose **SoundFont**, then **Load a SoundFont file**.
2. Pick any `.sf2` or `.sf3` file. MuseScore General is a free, realistic choice
   (search for "MuseScore General soundfont"; the `.sf3` download is the small one).
3. Choose the piano, bass and drum kit. The app remembers the file for next time.

The app does not ship with a SoundFont, which keeps it small and avoids licence
questions. The files stay on your computer. The player uses General MIDI numbers:
pianos 0 to 5, basses 32 to 35, and drum kits on bank 128. It supports volume
envelopes, loops, filter and pan. It does not do reverb or chorus.

## Publish downloads from GitHub

The workflow in `.github/workflows/build.yml` builds the Windows installer on
GitHub's servers, so you do not need to build it on your own computer.

1. Push this project to a GitHub repository.
2. Open the **Actions** tab, choose **Build Windows installer**, then **Run workflow**.
   - Leave the box empty to download the `.exe` files from the finished run
     (under **Artifacts**).
   - Or type the tag of an existing release (for example `v1.0.0`) to have the
     `.exe` files attached to that release automatically.
3. Wait about five to ten minutes.

It also runs by itself when you publish a release or push a tag that starts with `v`.

You get two files: `The Backing Track App Setup <version>.exe` (the installer) and
`The Backing Track App <version>.exe` (a portable copy that needs no install).

The build is not code-signed. Windows may show a SmartScreen warning ("More info",
then "Run anyway"). For macOS or Linux builds, add them to `npm run dist` on a
Mac or Linux machine.

## Updating Electron

`package.json` pins Electron 33 and electron-builder 25. To move to current versions:

```bash
npm install --save-dev electron@latest electron-builder@latest
```

## How the band works

`app/app.js` has everything.

- **Chords** are stored as a distance from the tune's tonic plus a quality, so one
  chart works in every key.
- **Piano** plays rootless voicings (3rd, 7th, 9th/13th) in one of several rhythm
  patterns chosen each bar.
- **Bass** walks through chord tones and ends each segment with a chromatic
  approach note into the next chord. Bossa and ballad use simpler patterns.
- **Drums** are synthesized from filtered noise and oscillators: swing ride and
  hi-hat, a bossa clave over two bars, or brushes for ballads.
- A look-ahead scheduler queues notes slightly before they play, which keeps the
  time steady even when the screen is busy.

## Ideas for later

- Swap the synthesized band for recorded stems, or render tracks with an AI music
  service. Notes are scheduled per beat in `playBeat`, so there is one place to plug
  in a sample player.
- Bundle the fonts for fully offline use
- More feels (funk, Latin, waltz) and 3/4 time
- Import and export of custom charts

## License

MIT. See `LICENSE`.
