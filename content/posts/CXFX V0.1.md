+++
title = "Introducing CXFX: The CX Graphics Library"
tags = [
	"Announcements",
	"CX",
	"CXFX",
	"Development",
]
bounty = 0
date = "2019-03-11"
description = "Introducing CXFX, a graphics library for the CX programming"
image = "img/Skycoin-CXFXv01.jpg"
aliases = [
	"/development-updates/skycoin-development-update-136/",
	"/development-updates/cxfx-v0.1/",
]
+++

CXFX's objective is to facilitate the development of games and applications using [CX](https://github.com/skycoin/cx),
allowing developers to focus on building their apps instead of having to write everything from scratch! This is a way to share and factorize knowledge.

At first, [CXFX](https://github.com/skycoin/cxfx) will be a library-only environment,
allowing you to access CXFX functionalities from a CX program.
The eventual goal is to have something like a [WYSIWYG (what you see is what you get](https://en.wikipedia.org/wiki/WYSIWYG)) game editor, like Unity.

Disclaimer: CXFX is a work in progress, and the API will change as it matures.

You can find the code in the [CXFX repo](https://github.com/skycoin/cxfx) as the project is now officially supported by the Skycoin team. Congratulations 2dbug!

#### Version 0.1 of CXFX

Work in Progress:

- Openal abstraction (.wav playback)
- Opengl abstraction (texture/shaders/meshes)
- Matrix
- 2d GUI toolkit
- Cameras
- GLTF loader
- PBR

If you'd like to start playing around with CXFX, you can [check out some CXFX tutorials](https://github.com/skycoin/cxfx#tutorials-).
The tutorials are numbered and progress through the functionalities. You can launch them from the tutorials dir by running:

`sh
make 0_colored_quad ... make 9_batch ...
`

#### What's needed

Making CXFX into what it needs and deserves to be is a huge undertaking!

Although started by one man, there's only so much he can do...

Skycoin is allocating resources to help progress the engine, however this is a community project at heart and will require all able bodies onboard to help.

Whether you're a programmer, writer, audio expert or just intrigued by the project and looking to help out... We want your help! You can join the [CXFX Telegram group](https://t.me/Skycxfx).

#### General Help

- Writing apps with CXFX
- Testing the tutorials
- Reporting bugs
- Feedback regarding the usage (what needs to be improved, what functionalities are missing etc.)
- Documentation of the tutorial code
- Documentation for the lib (should be driven by the tutorials)
- Writing small self-contained examples.  Tutorials walk through a little game creation, we should also have some small examples.
- Writing GUI examples

#### Developer Contribution: Expanding Functionalities

- Math lib (Matrix/Vector/Quaternion)
- Collision detection
- Physics
- Model export and loading
- Handling resize events (Toggle fullscreen)
- Cameras (TPS, FPS..., smooth motions)
- Audio streaming
- 3D audio
- MP3 playback
- WAV f32 and f64
- Lighting/shading
- Hot reload of shader files
- Refactor/improve/debug/bulletproof the 2d UI toolkit (it's unstable now)
- Texture compression
- `grep -RHn TODO` in `lib/cxfx/`
- `grep -RHn ISSUE` in `lib/cxfx/` those are cx language issues, they need to be extracted in small cx programs and opened as issue on skycoin/cx
- GUI serialization in json
- Leaderboards, using [CXO](https://github.com/skycoin/cxo)
- CX linter
- Blockchain integration
- Code cleanup
- Resource cleanup
- Optimizations
- API design
- Porting to mobile
- R&D regarding iOS Metal and Android Vulkan

The best way to contribute to the development of CXFX is to [fork the Skycoin/CXFX repo](https://github.com/skycoin/cxfx) and make some pull requests against the `develop` branch.

Keep an eye out for version 0.2 which should be released very soon!

* Github: <https://github.com/skycoin/cxfx>
* Website: <https://www.skycoin.com/>
* Telegram: <https://t.me/Skycoin>
