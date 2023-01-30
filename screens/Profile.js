import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import firebase from "firebase";
import { Switch } from "react-native-gesture-handler";


SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      name: "",

    };
  }

  async fetchUser() {
    let theme, name, image
    await firebase.database().ref("/users/" + firebase.auth().currentUser.uid).on("value", function (
      snapshot
    ) {
      theme = snapshot.val().current_theme;
      name = "${snapshot.val().first_name}${snapshot.val().last_name}"
    })
    this.setState({
      name: name,
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
    })
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  toggleSwitch=()=>{
    const previous_state = this.state.isEnabled
    const theme =! this.state.isEnabled ? "dark" : "light"
    var updates = {}
    updates ["/users/"+firebase.auth().currentUser.uid+"/current_theme"] = theme
    firebase.database().ref().update(updates)
    this.setState({isEnabled : !previous_state, light_theme : previous_state})
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.appTitleTextContainer}>
            <View style={styles.profileImageContainer} >
              <Image
                source={require("../assets/profile_img.png")}
                style={styles.profileImage}
              >
              </Image>
              <Text> {this.state.name} </Text>
            </View>
            <View>
              <Text> Dark Theme </Text>
              <Switch
                style={{
                  transform: [{ scaleX: 1.3 },
                  { scaleY: 1.3 }]
                }}
                trackColor={{
                  false: "blue",
                  true: "white"
                }}
                thumbColor={
                  this.state.isEnabled ? "red" : "yellow"
                }
                ios_backgroundColor="gray"
                onValueChange={() => { this.toggleSwitch() }}
                value={this.state.isEnabled}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: { width: RFValue(140), height: RFValue(140), borderRadius: RFValue(70) },
  nameText: { color: "white", fontSize: RFValue(40), fontFamily: "Bubblegum-Sans", marginTop: RFValue(10) },
  themeContainer: { flex: 0.2, flexDirection: "row", justifyContent: "center", marginTop: RFValue(20) },
  themeText: { color: "white", fontSize: RFValue(30), fontFamily: "Bubblegum-Sans", marginRight: RFValue(15) }
});
