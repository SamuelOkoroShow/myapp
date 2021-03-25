import React, {useCallback, useState, useContext} from 'react';

// Using styled-components to have easily resuable components
import styled from 'styled-components/native';

//Importing shared components
import {AppProviderContext} from '../provider/index';
import {bdazzled, forgra, platinum, tomato} from '../colors';
import {Error, Credentials} from '../provider/types';
import {Container} from './shared';

// Local components
const Input = styled.TextInput`
  height: 70px;

  border-top-width: 1px;
  border-color: ${forgra};
  font-size: 17px;
  padding: 0px 0px 0px 20px;
  color: ${platinum};
`;

const SignInBtn = styled.TouchableOpacity`
  justify-content: center;
  height: 80px;
  background-color: ${forgra};
  border-bottom-width: 1px;
  border-color: ${bdazzled};
  padding: 0px 0px 0px 20px;
`;

const SignInTxt = styled.Text`
  color: ${platinum};
  font-size: 20px;
`;
const ErrorMsg = styled.Text`
  color: ${tomato};
  font-size: 14px;
`;
const NoError = styled.Text`
  color: ${forgra};
  font-size: 16px;
`;

const ErrorBlock = styled.View`
  height:40px
  padding:0px 0px 0px 20px;
  justify-content: center;
`;

const errorDefault: Error = {
  active: false,
  msg: 'Hello world!!',
};

// Type
interface Props {
  navigation: any;
}

const Login: React.FC<Props> = props => {
  // All useState hooks.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Error>(errorDefault);
  // All useContext hooks.
  const app_global_state = useContext(AppProviderContext);

  // Validates user input by email and password
  const validateCreds = useCallback(() => {
    const creds: Credentials = {email, password};
    const access = app_global_state.validateSignIn(creds);

    // Triggers a navigation action or an error message.
    if (access) {
      props.navigation.navigate('Home');
    } else {
      setError({
        active: true,
        msg: 'Either the email or the password is incorrect.',
      });
    }
  }, [app_global_state, email, password, props.navigation]);

  //Checks if email is a usable format.
  const validateEmail = useCallback(email_val => {
    setEmail(email_val);
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email_val).toLowerCase())) {
      setError({
        active: false,
        msg: '',
      });
    } else {
      setError({
        active: true,
        msg: 'Please enter a real email address.',
      });
    }
  }, []);

  // This could also use a function for app_global_state.signedIn

  return (
    <Container>
      <ErrorBlock>
        {error.active ? (
          <ErrorMsg>{error.msg}</ErrorMsg>
        ) : (
          <NoError>Blah, blah, blah...</NoError>
        )}
      </ErrorBlock>
      <Input
        placeholder="Email"
        onChangeText={validateEmail}
        value={email}
        keyboardType="email-address"
        placeholderTextColor={platinum}
      />
      <Input
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        keyboardType="default"
        value={password}
        placeholderTextColor={platinum}
      />
      <SignInBtn onPress={validateCreds}>
        <SignInTxt>Sign In</SignInTxt>
      </SignInBtn>
    </Container>
  );
};

export default Login;
