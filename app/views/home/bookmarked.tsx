// Imports follow the format: external, shared, local
import React, {useContext, useCallback} from 'react';
import {Alert, Linking, Text} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SwipeListView} from 'react-native-swipe-list-view';

// Next we need bookmarks from Provider and other shared compoenents
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

  // To replace MaterialTopTab for now
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

  // Uses your phone's preferred app for opening this types of links. Mine was Fasthub and Google Chrome.
  const handleLinkTouch = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  // Each item rendered by SwipeList View. Works the same as FlatList.
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

  // Deletes an item by id.
  const deleteItem = useCallback(
    (elem: Graph) => {
      const lists = app_global_state.bookmarks.filter(x => {
        return x.id !== elem.id;
      });
      app_global_state.setBookmarks(lists);
    },
    [app_global_state],
  );

  // Renders behind renderItem because of SwipeListView.
  const renderHiddenItem = (data: SwipeList) => (
    <RowBack>
      <BackLeftBtn>
        <WhiteText>Archived</WhiteText>
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
          previewOpenDelay={1000}
          disableRightSwipe
        />
      ) : (
        <IntroTxt>Bookmarks go here</IntroTxt>
      )}
    </Container>
  );
}
