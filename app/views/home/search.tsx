import React, {useCallback, useContext, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import styled from 'styled-components/native';
import GestureRecognizer from 'react-native-swipe-gestures';

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
import {forgra, platinum, shadow_blue} from '../../colors';

import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Text,
} from 'react-native';
import {Graph} from '../../provider/types';

const SearchBar = styled.TextInput`
  height: 70px;
  border-radius: 5px;
  background-color: ${forgra};
  font-size: 17px;
  padding-left: 17px;
  color: ${platinum};
  border-color: ${shadow_blue};
  border-bottom-width: 1px;
`;

const LoadingContainer = styled.View`
  margin-top: 20px;
  flex: 1;
`;

function Search({navigation}: StackScreenProps<{Bookmarks: any}>) {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);

  const newBookmark = useCallback(() => {}, []);
  const appState = useContext(AppProviderContext);

  const TopBar = () => (
    <BarContainer>
      <BarItem
        onPress={() => {
          appState.setSearchResults([]);
          navigation.navigate('Bookmarks');
        }}>
        <IntroTxt>Saved Searches</IntroTxt>
      </BarItem>
      <BarActive>
        <IntroTxt>Search</IntroTxt>
      </BarActive>
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

  const bookmarkItem = useCallback(
    (element: Graph) => {
      Alert.alert('Bookmarked ' + element.name);
      appState.setBookmarks([...appState.bookmarks, element]);
      Alert.prompt('Bookmark Added');
    },
    [appState],
  );

  const isCloseToBottom = useCallback(element => {
    const {layoutMeasurement, contentOffset, contentSize} = element;
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }, []);

  const reload = useCallback(() => {
    const graphed = async () => {
      const sorter = 'stars';
      const order = 'desc';
      const graph = await fetch(
        `https://api.github.com/search/repositories?q={${query}}&sort=${sorter}&order=${order}&per_page=100&page=${page}`,
      );
      const graphJson = await graph.json();
      if (graphJson) {
        appState.setSearchResults(graphJson.items);
        setLoading(false);
      }
    };
    graphed();
  }, [appState, page, query]);

  const auto_search = useCallback(
    q => {
      setQuery(q);
      setLoading(true);
      setPage(1);

      reload();

      if (appState.searchResults.length > 0) {
        setLoading(false);
      }
    },
    [appState, reload],
  );

  return (
    <Container>
      <TopBar />
      <SearchBar
        placeholder="Search GitHub..."
        value={query}
        maxLength={15}
        onChangeText={auto_search}
        placeholderTextColor={platinum}
      />
      <LoadingContainer>
        {loading ? (
          <ActivityIndicator color={platinum} />
        ) : appState.searchResults.length > 0 ? (
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                setPage(page + 1);
                reload();
              }
            }}>
            {appState.searchResults.map(element => (
              <GestureRecognizer
                key={element.id}
                onSwipeRight={() => bookmarkItem(element)}>
                <EachResult key={element.id}>
                  <TitleHolder
                    onPress={() => handleLinkTouch(element.html_url)}>
                    <TitleSection>
                      <Title>REPO NAME</Title>
                      <ResultTitle>{element.name}</ResultTitle>
                    </TitleSection>
                    <TitleSection>
                      <Title>REPO AUTHOR</Title>
                      <ResultTitle>{element.owner.login}</ResultTitle>
                    </TitleSection>
                  </TitleHolder>

                  <ToggleBookmark onPress={newBookmark}>
                    <Text>⭐</Text>
                    <ResultStars>{element.stargazers_count}</ResultStars>
                  </ToggleBookmark>
                </EachResult>
              </GestureRecognizer>
            ))}
          </ScrollView>
        ) : (
          <IntroTxt>Nothing To Report</IntroTxt>
        )}
      </LoadingContainer>
    </Container>
  );
}

export default Search;
