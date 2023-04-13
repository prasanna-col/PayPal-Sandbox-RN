# PayPal-Sandbox-RN
PayPal payment gateway integration with sandbox account in React-native app.

Ref URL: https://medium.com/zestgeek/paypal-integration-in-react-native-9d447df4fce1


# Redux toolkit

# Map

Install libs
1. yarn add react-native-geolocation-service
2. yarn add react-native-maps
3. @react-native-firebase/database
4. @react-native-firebase/app
5. firebase
6. need to put API key in AndroidManifest file for android.
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="Your Google maps API Key Here"
    />
7. react-native-background-geolocation && react-native-background-fetch
    android manual link: https://github.com/transistorsoft/react-native-background-geolocation/blob/master/help/INSTALL-ANDROID.md

## for iOS
1. npm: react-native-permission
    Add following code at package.json
     "reactNativePermissionsIOS": [
        "AppTrackingTransparency",
        "LocationAccuracy",
        "LocationAlways",
        "LocationWhenInUse"
        ],
        
2. in podfile 
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-LocationAlways', :path => "#{permissions_path}/LocationAlways/Permission-LocationAlways.podspec"
pod 'Permission-LocationWhenInUse', :path => "#{permissions_path}/LocationWhenInUse/Permission-LocationWhenInUse.podspec"

3. in infoplist
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>This app needs access to your location.</string>
  <key>NSLocationAlwaysUsageDescription</key>
  <string>This app needs access to your location.</string>
  <key>NSLocationTemporaryUsageDescriptionDictionary</key>
  <dict>
    <key>API_KEY_HERE</key>
    <string>This app needs access to your location.</string>
  </dict>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>This app needs access to your location.</string>
