# SG_GDA

## What's up

Hey, how's it going. Glad you made it this far.

A couple of thoughts and notes on this repo:

I wish I could've poured more time and love into this assignment. Unfortunately I'm working on a very consuming project in my current company, so I gotta be a little strict on how to divide my time here. But I hope I get to tell you about the other project, it's fun and I'm very proud of it.

For this repo, I set it up mostly the way I personally prefer to have my projects laid out. Of course, this grew over the past years and wouldn't necessarily fit any team, any place. I also acknowledge that it might not be super detailed right now: The scene manager is a little wonky and usually I would rely more on EventEmitters. Generally I would've probably opted for Phaser to quickly sketch a project, but adhered to the requirements.

I would consider myself creative and I certainly do have opinions on visual design, but I also like to not dabble too much in this topic, as I usually work with very reliable artists, that can iterate fast.

To be efficient, I did use an AI agent to sketch out some of the systems you can see here and adjusted them accordingly. That being said, I was lucky enough to learn my craft before the widespread use of Code AI.

Hope to hear back from you and discuss in more detail.

KP

## Ideas / TODO

### General

- nicer palette/ fonts
- fullscreen toggle for non-keyboard client

### Ace Of Shadows

- depth rendering is not perfect, but for now is only obvious in edge-cases.
- cards could scale according to screen size
- add perspective (card in the back smaller)
- completely randomised card transfers (would require aforementioned improved depth system)

### Magic Words

- add notif sound
- add "writing" three dots
- make messages appear instantly, not scrolling

### Phoenix Flame

- well, all kinds of stuff: in an ideal world I would probably write a ParticleEmitter class or leverage the Phaser one.
- I understand the impact of recycling and instancing on performance.
