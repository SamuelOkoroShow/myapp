import React, {useContext, useCallback} from 'react';
import {Alert, Linking, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SwipeListView} from 'react-native-swipe-list-view';

// Next we need bookmarks from Provider
import {AppProviderContext} from '../../provider/index';
import {
  BackLeftBtn,
  BackRightBtn,
  BarActive,
  BarContainer,
  BarItem,
  Container,
  EachResult,
  IntroTxt,
  ResultStars,
  ResultTitle,
  RowBack,
  Title,
  TitleHolder,
  TitleSection,
  ToggleBookmark,
  WhiteText,
} from '../shared';
import {Graph, SwipeList} from '../../provider/types';

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

  const _renderItem = (data: SwipeList) => {
    const element = data.item;
    return (
      <EachResult
        onPress={() => handleLinkTouch(element.html_url)}
        key={element.id}>
        <TitleHolder>
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
    );
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

  const renderHiddenItem = (data: SwipeList) => (
    <RowBack>
      <BackLeftBtn>
        <WhiteText>Archive</WhiteText>
      </BackLeftBtn>
      <BackRightBtn onPress={() => deleteItem(data.item)}>
        <WhiteText>Trash</WhiteText>
      </BackRightBtn>
    </RowBack>
  );

  return (
    <Container>
      <TopBar />
      {app_global_state.bookmarks.length > 0 ? (
        <SwipeListView
          data={app_global_state.bookmarks}
          renderItem={_renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={0}
          rightOpenValue={-75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      ) : (
        <IntroTxt>Bookmarks go here</IntroTxt>
      )}
    </Container>
  );
}
