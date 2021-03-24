import React, {useCallback, useState, useContext} from 'react';
import styled from 'styled-components/native';

import {AppProviderContext} from '../provider/index';
import {forgra, platinum} from '../colors';
import {Error, Credentials} from '../provider/types';
import {Container} from './shared';
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
  padding: 0px 0px 0px 20px;
`;

const SignInTxt = styled.Text`
  color: ${platinum};
  font-size: 20px;
`;
const ErrorMsg = styled.Text`
  color: ${'#FF6347'};
  font-size: 16px;
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
  msg: "What's up!!",
};

const Login: React.FC = props => {
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [error, setError] = useState<Error>(errorDefault);

  const app_global_state = useContext(AppProviderContext);

  const validateCreds = useCallback(() => {
    const creds: Credentials = {email, password};
    const access = app_global_state.validateSignIn(creds);
    if (access) {
      props.navigation.navigate('Home');
    } else {
      setError({
        active: true,
        msg: 'Either the email or password is incorrect.',
      });
    }
  }, [app_global_state, email, password, props.navigation]);

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
        emailAddress
        placeholderTextColor={platinum}
      />
      <Input
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        password
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
