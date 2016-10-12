#Series Organizer
*Organize your shows and track your progress*

##Installing
The most recent release version of the add-on can be installed from the [Mozilla Add-on Page](https://addons.mozilla.org/en-US/firefox/addon/series-organizer)

##About
Series Organizer is an Add-on for Firefox that will allow you to manage a list of the current shows you are watching so you always know what episode you're on and can keep track of shows you want to watch. A release version is currently under review by Mozilla.

##Running from source
Add-ons that are not signed by Mozilla cannot be enabled on Release versions of Firefox, a [Developer's Editon](https://www.mozilla.org/en-US/firefox/developer/) is required.
The Jetpack Manager (jpm) is also required to run the add-on. Follow [this guide](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm) to install.
Once jpm is installed, navigate to the folder containing the source code and execute the run command with the binary flag (-b) and point it to the Developer's Edition of Firefox
```
jpm run -b "C:\Firefox Developer Edition\firefox.exe"
```
In order to retain data, like the saved entries, the code must be run with the same Firefox profile each time. Create a profile and run the following (substituting the example paths with your actual ones):
```
jpm run -b "C:\Firefox Developer Edition\firefox.exe" --no-copy --profile "C:\Firefox\Profiles\oysr.TestProfile"
```

##Contributing
Feel free to open issues and create pull requests.