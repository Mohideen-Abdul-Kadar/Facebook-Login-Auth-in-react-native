/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

const App = () => {
  const [name, setname] = useState();
  const fbLogin = resCallback => {
    LoginManager.logOut();
    return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      result => {
        console.log('fb resultttttt', result);
        if (
          result.declinedPermissions &&
          result.declinedPermissions.includes('email')
        ) {
          resCallback({message: 'Email is required'});
        }
        if (result.isCancelled) {
          console.log('error');
        } else {
          const infoRequest = new GraphRequest(
            '/me?fileds=email,name,picture,friend',
            null,
            resCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log('login fail with error', error);
      },
    );
  };

  const onFbLogin = async () => {
    try {
      await fbLogin(responseInfoCallback);
    } catch (error) {
      console.log('error raised', error);
    }
  };
  const responseInfoCallback = async (error, result) => {
    if (error) {
      console.log('error bro ', error);
      return;
    } else {
      const userData = result;
      console.log('fb data======>', userData);
      setname(userData.name);
      // console.log('name', userData.name);
    }
  };
  // LoginManager.logInWithPermissions(['email', 'public_profile']).then(
  //   function (result) {
  //     if (result.isCancelled) {
  //       console.log('Login cancelled');
  //     } else {
  //       console.log(
  //         'Login success with permissions: ' +
  //           result.grantedPermissions.toString(),
  //       );
  //     }
  //   },
  //   function (error) {
  //     console.log('Login fail with error: ' + error);
  //   },
  // );

  return (
    <View style={styles.body}>
      <Text style={styles.text}>FACEBOOK LOGIN</Text>
      {/* <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        /> */}
      <View style={styles.color}>
        <TouchableOpacity onPress={onFbLogin}>
          <Text style={{textAlign: 'center', fontSize: 24, color: '#fff'}}>
            facebook login
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, {textAlign: 'left'}]}>USER NAME: {name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
  },

  color: {
    borderWidth: 3,
    borderColor: '#fff',
    height: 45,
    width: 230,
    backgroundColor: '#4267B2',
    borderRadius: 5,
    alignSelf: 'center',
  },
});

export default App;

// {/* <LoginButton
// onLoginFinished={(error, data) => {
//   Alert.alert(JSON.stringify(error || data, null, 2));
// }}
// /> */}
