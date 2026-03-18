+++
aliases = []
date = "2019-05-20T00:00:00+00:00"
description = "Skycoin Antenna Development Bringing the New Internet to Everyone, Everywhere"
draft = true
image = "/img/Skywire Graphic Design.jpeg"
tags = ["Skywire", "Antenna"]
title = "Skycoin Antenna Development"

+++
***

**Vision of Skywire and its place in the future**

The Skycoin Antenna is part of Skycoin’s hardware suite. Skycoin Antennas attached to Skywire nodes will use their long range to connect users around the world to the Skywire network. We currently use a wide variety of devices like radios and cell phones which all utilize different spectrums. In the future, we anticipate a convergence era of telecommunication where all electronic devices will be equipped with computer chips, (lights, appliances, etc.) and all forms of telecommunication (radio, internet, satellite, etc.) will merge into one universal frequency for all connected things. The need for, and our reliability on constant and reliable connection is where distributed mesh internet shines. Skycoin is building a network that can deliver high-quality bandwidth for everything from the Internet of things (IoT devices) to autonomous vehicles. Skywire’s advanced protocol is built with these high demand use cases in mind, and to help use it we’ve built the Skycoin Antenna.

**![Skywire antenna alpha prototype](https://lh3.googleusercontent.com/t9ssykVnYVFD_nHHQO87EN7DSBplGUNYkiUkjAfJyZIKoRaut-LhqwO7OABkWaLVNVkwPqmQKpE4Uekb2_ln0Ec-6LsIvHNYOdHrnhC9Ana9IFs6yFiAzQwb_RIlM-OyjHwfGXuZ "Skywire Antenna Alpha Prototype" =624x416)**

**Enter the Hardware Team**

Our first prototype of the Skycoin antenna was a compact parabolic signal transmitter with rotors to aim the dish in all directions. Parabolic antennas excel at emitting narrow, and hence far-reaching signals. We used a 3D printer to make the dish and rotor gears and the kit was made with laser cut plastic, and acrylic parts.

{{< figure src="/img/Skywire antenna prototype v1.png" title="_First prototype of the Skywire antenna._" >}}

We chose a 3 decibel strength dipole antenna patch, amplified by a dish to put out roughly 10 decibels. A decibel, abbreviated dB is, “a unit of measurement used to express the ratio of one value of a power or field quantity to another on a logarithmic scale.” But don’t let that definition confuse you, in this context it’s basically a measurement of signal power. This parabolic antenna achieved a 5.2 Ghz frequency (5G) signal of 10 Db which translated into a signal range of less than 5 km. This was not enough power for the signal range that we ideally wanted for Skywire.

Frequency: 5.2 Ghz

Decibels: 10

Signal: Directional

Polarity: Circular polarity in order to maximize gain from receiving antennas.

Feed Element: 1 dipole antenna

![Mesh internet antenna version 1](https://lh3.googleusercontent.com/fJWs-h3-epdJVbiVk7uNGq3r6Mzgj5Jog9dPr2XjUv5lzKHh7I_kLSpgzOJprdqz4JUq2lBI8wzb9Pt6qYaSqtdy2LnuuPuh9oj96YyLut1bR7VCe1yDdpLU4pni_xez3sqKsO_C "Mesh internet antenna version 1" =179x255)![Mesh internet antenna version 1](https://lh6.googleusercontent.com/i6j4MBFRW8oD-C-x9gMX8I6UqiH1pOmF3ZM_WYfMTiBmFO4MAWEJrlaFu4FUFg3Whw5cjHyjd7LoFSldT-quT7MIwqF8y352oWrJo0qaPdW7xW2wXAH8uxxrc-8yoliYz6GDZkyM "Skywire Antenna Version 1" =237x255)

**Second Trial: Parabolic Antenna VS Array Antenna (December 2018**)

For our next trial we decided to create and test 2 different types of antennas against each other: a parabolic dish antenna, and a phased array antenna (both 5.2 Ghz). Our new objective was to triple the signal range of the former model and get it to roughly 15 km, every 6 Db the antenna signal roughly doubles in range. We needed to boost the output of these antennas to 24 Db each, representing a 10-fold signal amplification over the 10 Db achieved in our earlier model, and over 3 times the range. For these models we used a patch antenna instead of a dipole antenna, the patch was designed in-house to yield a higher initial signal strength of 13 Db and arranged a manufacturer to mass produce them for us.

\**Parabolic Antenna
\**Frequency: 5.2 Ghz

Decibels: 24

Signal: Directional , polarity: Circular polarity

Feed Element: 1 patch antenna amplified by a dish

\**Phased Array Antenna
\**Frequency: 5.2 Ghz

Decibels: 24

Signal: Directional, polarity: Circular polarity

Feed Element: 16 patch antenna array

We were able to achieve 24 dB with both the antenna, however, these tests fell short of our 15 km range target. Ultimately, we decided on the parabolic antenna for two reasons: range and product efficiency. The parabolic antenna can generate a more focused and narrow beam capable of longer distance, and is also a more compact, economical antenna to produce. The dish antenna only requires one patch antenna compared to the heavier arrays, 16-patch antenna.

**Upgraded Dish Antenna (5.8Ghz)**

The minimum dish diameter in order to emit 5.8Ghz at its full wavelength is 40 cm. With the dish amplifying the signal, we expected the 13 Db PCB antenna patch to gain 20-30 Db, which would convert to a range of 10 km. The purpose of a parabolic dish is to focus the signal beam. A dish of 40 cm can emit a beam width of 10 degrees, allowing a possible distance of 15 km. Our parabolic dish is lightweight and aerodynamic which will not affect its performance, but will take less power to move around with motors and be less affected by winds.

“Once these figures are achieved, we will then turn the full wavelength into a quarter wavelength (\~/4 wavelength) which will enable us to downsize the parabolic antenna while retaining almost identical frequency as well as beam degree and distance.” \~ **Hardware Team**

{{< figure src="/img/39cm dish antenna.png" title="_39cm parabolic dish with PCB patch feed_" >}}

{{< figure src="/img/patch antenna feed.png" title="_PCB patch feed at the focal point of the parabolic dish_" >}}

**Beam width Testing**

We tested the signal range of our upgraded antenna at 2.4Ghz and 5.8Ghz at three different distances: 100 meters, 200 meters and 450 meters. For our 2.4GHz frequency antenna, our beam width was approximately 20 degrees and for our 5.8GHz antenna the beam width was 8 degrees.

{{< figure src="/img/100 meter test.png" title="_Test from 100 meters without amplifying dish_" >}}

**100 meter test:**

We conducted our 100 meter test using 5.8Ghz within the corridor of an abandoned building. The data rate was 3.12 Mbps. In this test we didn’t use the parabolic dish, we just used the 5.8Ghz PCB patch antennas facing towards each other. We used 802.11ac WiFi and standard USB WiFi devices connected to two laptops, and communicating with each other using a peer-to-peer (P2P) connection, transferring files from one laptop to another.

**200 meter test:**

Next conducting our 200 meter 5.8Ghz test, we went to the 4th floor of the building and the field below. This time we used our PCB patch in conjunction with our 39 cm dish on one side and just a PCB patch on the ground. The P2P connection and file transfer rate was 4.16 Mbps for this test.

{{< figure src="/img/200 meter test.png" title="_Photos from our 100 meters test_" >}}

**450 meter test:**

Finally we tested our 5.8Ghz dish antenna over 450 meters from the rooftop of the abandoned building across to the other side of the park, with just a PCB patch to catch the signal. The P2P connection and file transfer rate was 4.15 Mbps, only 0.01 Mbps slower than at 200 meters.

{{< figure src="/img/450 meter test.png" title="_Our engineers taking photos on the field and in the sky: 450 meter test_" >}}

**Test Results**

Only losing 0.01 Mbps of data transfer speed between 200 and 450 meters was a great success. It is a good indicator that the signal is able to hit our target distance of roughly 15 km. Using two parabolic dishes on both ends, we could achieve an even longer range and see improvement in the data transfer speed as the signal strength would be much higher on both ends.

**Final Testing**

Now we are working on reducing the size of the dish and making the antenna more compact, turning the full wavelength into a Quarter wavelength (\~/4 wavelength) using a 14 cm dish. First, we will try it with a 2.4GHz and a 5GHz dipole and patch antennas. This may prove challenging with this frequency because the size of the dish is very small as compared to the wavelength of these frequencies. Dish diameter should be at least 8-10 times the wavelength. However, our ultimate goal is to make it work with 24GHz frequency, and the wavelength for that is about 1.2 cm. At a dish size of 14 cm we have roughly 10 times this wavelength. We are confident it will work with that dish size and transmit at longer range. For now we don’t have any device that can send or receive signals at 24GHz, which is another project. So we are testing with the WiFi USB adapters as they support 2.4Ghz and 5GHz frequencies.

New design files of the 14 cm parabolic dish with the dipole feed antenna have been sent for manufacturing. We will test them after we get those design prototypes. Later when we have the module to process 24GHz signal for transmission and receiving end, we can change the dish size to 14 cm. We’ll keep you updated as we get closer to production. In the meantime, the Skywire Mainnet is live so you don’t have to wait until the antenna is ready to join the network.

**Run Your Own Skyminer and Earn Coin Hours!**

The more users on a network, the stronger it is. Do your part to provide peer-to-peer uncensored internet to everyone today by operating a Skyminer. Be your own ISP and earn Skycoin Coin Hours. Purchase a Skyminer at [https://store.skycoin.com/](https://store.skycoin.com/ "https://store.skycoin.com/")
