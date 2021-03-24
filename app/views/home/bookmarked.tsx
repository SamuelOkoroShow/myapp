import React, {useContext, useCallback} from 'react';
import {Alert, Linking, ScrollView, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import GestureRecognizer from 'react-native-swipe-gestures';

// Next we need bookmarks from Provider
import {AppProviderContext} from '../../provider/index';
import {
  BarActive,
  BarContainer,
  BarItem,
  Container,
  EachResult,
  IntroTxt,
  ResultStars,
  ResultTitle,
  Title,
  TitleHolder,
  TitleSection,
  ToggleBookmark,
} from '../shared';
import {Graph} from '../../provider/types';

export default function Bookmarked({
  navigation,
}: StackScreenProps<{Search: any}>) {
  const app_global_state = useContext(AppProviderContext);

  const TopBar = () => (
    <BarContainer>
      <BarActive>
        <IntroTxt>Saved Searches</IntroTxt>
      </BarActive>
      <BarItem onPress={() => navigation.replace('Search')}>
        <IntroTxt>Search</IntroTxt>
      </BarItem>
    </BarContainer>
  );

  const handleLinkTouch = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const deleteItem = useCallback(
    (elem: Graph) => {
      const lists = app_global_state.bookmarks.filter(x => {
        return x.id !== elem.id;
      });

      Alert.alert(`Deleted ${elem.name}`);
      app_global_state.setBookmarks(lists);
    },
    [app_global_state],
  );

  return (
    <Container>
      <TopBar />
      <ScrollView>
        {app_global_state.bookmarks.length > 0 ? (
          app_global_state.bookmarks.map(element => (
            <GestureRecognizer
              key={element.id}
              onSwipeLeft={() => deleteItem(element)}>
              <EachResult key={element.id}>
                <TitleHolder onPress={() => handleLinkTouch(element.html_url)}>
                  <TitleSection>
                    <Title>REPO NAME</Title>
                    <ResultTitle>{element.name}</ResultTitle>
                  </TitleSection>
                  <TitleSection>
                    <Title>REPO AUTHOR</Title>
                    <ResultTitle>{element.owner.login}</ResultTitle>
                  </TitleSection>
                </TitleHolder>

                <ToggleBookmark>
                  <Text>⭐</Text>
                  <ResultStars>{element.stargazers_count}</ResultStars>
                </ToggleBookmark>
              </EachResult>
            </GestureRecognizer>
          ))
        ) : (
          <IntroTxt>Bookmarks go here</IntroTxt>
        )}
      </ScrollView>
    </Container>
  );
}
