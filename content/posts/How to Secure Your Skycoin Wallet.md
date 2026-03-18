+++
aliases = ["/statement/how-to-secure-your-skycoin-wallet/"]
date = "2018-01-03"
tags = ["Statement"]
title = "How to Secure Your Skycoin Wallet"

+++
## Instructive guide on how to safely store your Skycoin

We are currently working diligently to provide encryption functionality to the wallet. You can view our progress on this issue here: https://github.com/skycoin/skycoin/issues/479. While we are doing so, we would like to provide some clarity on the best ways to safely store your Skycoin. You can download the Mac, Linux, and Windows versions of the Skycoin wallet from https://www.skycoin.com/downloads/. After doing so, you will be presented with the option to create a new wallet once you open the application. Click the make new wallet button. You will then be presented with a specific string of words, your seed, that you will need to safely store your Skycoin. This string of words will allow you to access the funds in that specific wallet address at any time, regardless of whether the Skycoin wallet is downloaded on your computer. Write down this string of words in multiple places. After writing it down, store the piece of paper or notebook in a safe where only you can access it. If anyone is able to find your private seed, they will be able to load your wallet and send your Skycoin anywhere as they please. For maximum security, after writing down the seed you can either delete your Skycoin wallet file from your computer, or manually encrypt it. To delete your Skycoin wallet file from your computer, you will need to use the command line to remove the .wlt files. On Mac OS computers, the Skycoin folder will be located at /Users/yourUsernameHere/.skycoin. On Windows computers, \\Users\\yourUsername.skycoin. To access this folder, you will need to use your command line. To open your command line on Mac OS, hit command+space and search "Terminal" and hit enter. Now you are at the command line. To navigate to the skycoin folder, you will need to use this command

    cd ~/.skycoin

After you are here, you should backup this folder so that you have access to the .wlt files should you ever lose your private seed. To backup this folder, you can use a usb drive or a external hard drive and copy the folder onto one of those devices. After doing this, you can proceed with deleting your wallet files. Enter this command to see the listed folders:

    ls

After entering this command in the terminal, you should see a "wallets" folder. To delete your .wlt file, you will need to remove the files in this folder from your machine. To do so, use this command:

    cd wallets

After this, you will be present in the wallets folder, now you will need to look at the files present in this folder to delete them.

    ls

After listing the files, you should see one or multiple .wlt files. To delete these files, you will need to use this command

    rm InsertWalletNameHere.wlt

After you have done this for each of the wallet files, they will no longer be stored on your computer, so even if your computer is compromised by a virus or a hacker, nobody will be able to steal your funds.
Now, if you ever want to access your Skycoin wallet again, you will have to load the wallet using the seed that you have written down.

For windows and linux users, you can follow these same instructions, but you will need to replace these commands with the specific commands for your operating systems. These are very accessible on Google.

If you do not want to delete your wallet files completely from your computer, the other option is to manually encrypt your wallet. One of our community members has provided a great guide on how to do this here: https://skywug.net/forum/Thread-Encrypt-Skycoin-Wallet

Please contact us at in our telegram at https://t.me/Skycoin or at contact@skycoin.com if you have any questions!
