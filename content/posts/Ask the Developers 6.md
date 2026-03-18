+++
aliases = ["/ask-the-developers/ask-the-developers-6/"]
date = "2014-12-19"
description = "A weekly session where users can comment or ask questions to the Skycoin Developers in order to gain a better insight and understanding into the Skycoin Project "
draft = true
tags = ["Ask the Developers"]
title = "Ask the Developers #6"

+++
## Comment:

Quote from: **esuncloud** on December 19, 2014, 05:24:09 PM
>We are experts with Verilog, CPLD, FPGA, ASIC, SoC design, and how could we help you guys? According to my knowledge, there is no Verilog repo on Github for us to contribute code.

## Response:
This is an amplitude modulated software defined radio for the whitespace band. 100 Mhz to 700 Mhz carrier. This is the most simple type of radio possible. Its pretty trivial.

Can you hook up an FPGA, maybe one on an ARM development board to an CPLD. We need to take a 600 Mhz to 700 Mhz carrier and amplitude modulate it (multiply the amplitude of the carrier by a value, which changes and can be set). The CPLD needs to implement a Digital to Analog (DAC) converter and then amplitude modulate the carrier. Then this gets amplified and is connected to antenna.

Then we need a Analog to Digital (ADC) implemented on the CPLD for receiving radio on other end. Changing the ADC/DAC 20 million times per second with a 4 to 8 bit ADC/DAC resolution is sufficient for now. A fulll 300 Mhz is ideal, but may not be possible without skillful pipelining.

For example. On beagleboard black, there are ADC/DAC units on the real time units. We can set output to "8" and then voltage level 8 comes out, we feed that into the gate on the amplifier. Then a ~50 Mhz HAM frequency carrier comes in to amplifier and is amplified an amount depending on voltage of gate. Then we change the 8 to a 40. With the real time unit, we can do that ~1 million times per second. Then the value gets amplified, fed into antenna and we are transmitting a sin wave with height 8. We have an array of bytes, one byte is read in a at a time and sets the output  value of the DAC, which updates 1 million symbols/second. So we are signaling with radio. This is same thing, except we want the ADC/DAC in the CLPD, so we can do hundreds of MHz and later modulation of the carrier twice per Hz, with changes applied at the zero crossing.

Eventually we want modulation at two symbols per Hz, so 1.4 billion times per second for 700 Mhz carrier (one output for positive part of sin phase and one for the negative phase) with 8 bit resolution for DAC output and +8 bit for ADC reception (or whatever is feasible). The value change for the analog output should occur at the zero crossing of the carrier, to prevent snapping. This will probably require moving the CPLD to ASIC to operate at this baud rate.

At 700 Mhz, with two 8-bit symbols per Hz we are at 11.2 Gb/s for maximum rate (two 8 bit symbols, 700 million times per second). That is the data rate for CPLD to the FPGA. Because of noise, antenna ringing and requirement for forward error correction (100 bits may have to be sent for each received bit), the data throughput may be significantly less than the symbol baud rate. The ASIC version may need a hardware IO protocol (PCIe or other) to interface between the CLPC/ASIC and FPGA at this rate. At those data rates the forwards error correction will need to be implemented in the FPGA, but CLPC prototype may be low enough baud rate for this to be performed in software. We are assuming that directional antennas are used and that the target signal is the loudest signal received, which significantly reduces the resolution requirements on the ADC for reception. Very simple circuit. We are not sure if phase locking or ability to set phase offset is a requirement.

Eventually the FPGA and CPLD, frequency generation and amplifier should be on a single PCB. The FPGA should implement Unipro so we can plug it in into an ARA baseboard. This is the end-target, but prototyping with ARM+FPGA dev board may be easier, or you may have better solution. Alternatively, the first device could be an CLPD + FPGA with a USB interface. Whatever is easier, you probably have a USB FPGA core already. The control board or system should use a Debian linux.

We can provide software in C for an initial forward error correction code. This can be on CPU initially, but move to FPGA is later required to handle full data rates (which may not be hit by the CPLD).

We understand the CPLD can go to 300 Mhz, so 300 MHz modulation of the carrier wave may possible without going to ASICs. Higher frequencies may be possible by including multiple copies of the circuit, with clock skews. For instance, having one DAC for the positive phase and  one for the negative phase. A simple CPLD design should be able to achieve a symbol rate of a few dozen Mhz. The ADC needs a floor and max and adjustment to bring the signal within range. This needs to be changed seldom (assume as most 1000 times per second).

I would get it working with a 1-bit or 2-bit ADC/DAC block on the CPLD and then go from there. Alternatively, if there is a very cheap ADC/DAC chip that can handle these ranges or 3 samples per second at 1.4 Ghz, we could use that and wire it into the FPGA. I have feeling that DAC/ADCs chip rated at the required sampling rate are $100 and that getting board down to $20 will require a degree of ASIC integration in the analog frontend.

##### So the objective here, is to get a lower frequency prototype working in CPLD
- to reduce risk for doing MOSIS/ASIC prototype that can handle full rate and higher resolution in the ADC/DAC. The symbol baud rate for the ASIC version may require integrated hardware IO pin for interface to FPGA, but is otherwise the same.
- then if that works, get a few wafers on an older process
- to have something working early, so that we can distribute dev boards and start on software development and prototyping, antenna development

##### That is first generation. Second generation
- multiple DAC/ADCs for running multiple antennas
- digital delay line (same signal from each output, but with defined phase shift and amplitude change) so that we can do phased array
- low frequency control or modulation of phase shift (to allow phase locking, reduce interference between transmitters)
- two antennas can resolve or filter on direction from phase shift of signal received by two antennas at a separation.
- N antennas elements each making independent reading of same signal, helps reduce noise floor.

---

## Comment:
Quote from:**xyzzyx** on January 23, 2015, 09:03:27 AM
>OP, what is the format of the wallet files found in "~/.skycoin/wallets"?  For example, on startup my wallet file looked like this (edited out actual numbers):

```
{
    "id": "XXXX",
    "type": "Deterministic",
    "name": "",
    "filename": "2015_AA_BB_CCCC.wlt",
    "entries": [
        {
            "address": "Kw5Rb7XNuHqoazHpCvrb1kzpH5hcRCophj",
            "public_key": "0268ee7bddefd1d876bf12c25c1acfb182383bffab856802c30a84094ecbd7bc0f",
            "secret_key": "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
        }
    ],
    "extra": {
        "seed": "XXXXYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
    }
}
```

>For example, I was able to make a new wallet file by hand that didn't crash skycoin by doing the following: (Of course, when generating an address one wouldn't use such a simple and easy to guess passphrase.)

```
go run ./cmd/address_gen/address_gen.go -seed="foo bar baz qix"
```
>Which outputs the public key, private key, and address of:

>039ed2af4adc49962682ba8777ffbc98b49286b4f319ec1ef6156814b56a82d107 0bdf7c021fe2c6085d4fac8f81714fe5a0457e45f1815105bd7073edca694f21 JaPkYZzEiEHwhNMN1D2iLsn2FFg31KNp8X

>I assume the seed property of the wallet is a SHA256 sum of the passphrase, so I do:

```Code: (bash)
echo "foo bar baz qix" | sha256sum --
```

>Which output a seed of "a345465605945b4223c2ce1407ea00f05695bb7ebda1b90bfed65435bfbb0bf2"

>Placing that into the format of the above wallet file, I get:

```
{
    "id": "a345",
    "type": "Deterministic",
    "name": "Foo",
    "filename": "2015_01_02_3333.wlt",
    "entries": [
        {
            "address": "JaPkYZzEiEHwhNMN1D2iLsn2FFg31KNp8X",
            "public_key": "039ed2af4adc49962682ba8777ffbc98b49286b4f319ec1ef6156814b56a82d107",
            "secret_key": "0bdf7c021fe2c6085d4fac8f81714fe5a0457e45f1815105bd7073edca694f21"
        }
    ],
    "extra": {
        "seed": "a345465605945b4223c2ce1407ea00f05695bb7ebda1b90bfed65435bfbb0bf2"
    }
}
```

The app appears to see the wallet:
![](/img/ask-devs-6-1.png)


>Is the above info on generating a valid wallet correct?   I have no currency so I cannot test sending to or from any of the addresses I've created, but they don't crash the app

## Response:

Yes. Good eye. I am glad that works.

Wallet format is defined in /src/wallet/wallet.go

Wallets are in "interface". So you can implement different wallets.
- There is a deterministic wallet that implements the interface (default)
- there is a "simple wallet" which just stores private keys like Bitcoin's wallet
- If you are company you might have N wallets, one per employee and with only receiving and not sending (implement interface)
- If you are an exchange, you might want a wallet that keeps customers funds separated by customer instead of mixing (implement interface)

The problem is, the existing wallet interface is horrible. Its better than Bitcoin's but it can be improved.
- look at /src/wallet/wallet.go
- look at /src/wallet/deterministic.go

For the wallet format. I think that there should just be a map, with optional fields
- "name" : "user chosen wallet name"
- "seed" : "actually a string, but hex SHA256 works too"

Then there should be an array. The array should be
- "Address : Privatekey" or "Address Publickey Privatekey"

We do not want people giving out private key by confusing it with public key

Maybe an array of maps

```json
{
  "address": "...",
  "seckey" : "...",
  "pubkey" : "...",
}
```

Also, "ID" I am not sure if ID should be in the wallet itself. Seed should be at the top of the wallet. The wallet format needs to be improved, cleaned up, simplified.

JSON API

Now that you found the wallet files, try this

```
go run ./cmd/skycoin/skycoin.go -web-interface=true
```

And open http://127.0.0.1:6420

Now look in `/src/gui/wallet.go`

See Bottom

![](/img/ask-devs-6-2.png)

These functions you can call in browser

http://127.0.0.1:6420/wallets

You get an array of your wallets

![](/img/ask-devs-6-3.png)

##### I am adding functions for
- getting all unspent outputs
- there should be function for getting block depth and other information (its probably in daemon)
- getting outputs for an address
- injecting transactions

If you add enough json functions, you can build the blockchain explorer inside of the wallet. You can check balances locally, instead of having to scrape blockchain.org like people do in Bitcoin.

Adding wallet from seed:

##### There was one function that did three things
- create wallet
- get wallet
- update wallet

I split the functions. So they are separate. There is not a seed parameter on the wallet creation.

You can now add a deterministic wallet by seed. There will be gui button for this eventually.
http://127.0.0.1:6420/wallet/create?seed=yourseed

---