import React, {useCallback, useContext, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import styled from 'styled-components/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';

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
} from '../shared';
import {forgra, platinum, shadow_blue} from '../../colors';
import {Graph, SwipeAbleMap, SwipeList} from '../../provider/types';

import {ActivityIndicator, Alert, Linking, Text} from 'react-native';

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

const RegularView = styled.View`
  flex: 1;
  flex-direction: row;
`;
const CenteredView = styled.View`
  height: 80px;
  align-items: center;
  justify-content: center;
`;
const LoadingContainer = styled.View`
  margin-top: 20px;
  flex: 1;
`;

function Search({navigation}: StackScreenProps<{Bookmarks: any}>) {
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [loadingMore, setLoadingMore] = useState<Boolean>(true);
  const [page, setPage] = useState<number>(1);

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
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const deleteRow = useCallback(
    (rowMap: SwipeAbleMap, rowKey: number) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
      const newData = [...appState.searchResults];
      const prevIndex = appState.searchResults.findIndex(
        (item: Graph) => item.id === rowKey,
      );
      newData.splice(prevIndex, 1);
      appState.setSearchResults(newData);
    },
    [appState],
  );

  const reload = useCallback(
    (q: string) => {
      const graphed = async () => {
        const sorter = 'stars';
        const order = 'desc';
        const graph = await fetch(
          `https://api.github.com/search/repositories?q={${q}}&sort=${sorter}&order=${order}&per_page=20&page=${page}`,
        );
        const graphJson = await graph.json();
        if (graphJson.items) {
          setError('');
          if (page === 1) {
            appState.setSearchResults([...graphJson.items]);
          } else {
            setLoadingMore(false);
            appState.setSearchResults([
              ...appState.searchResults,
              ...graphJson.items,
            ]);
          }
          setLoading(false);
        } else {
          setError(graphJson.message);
          setLoadingMore(false);
        }
      };
      graphed();
    },
    [appState, page],
  );

  const bookmarkItem = useCallback(
    (rowMap: SwipeAbleMap, element: Graph) => {
      appState.setBookmarks([...appState.bookmarks, element]);
      deleteRow(rowMap, element.id);
    },
    [appState, deleteRow],
  );

  const _renderItem = (data: SwipeList) => {
    const element = data.item;

    return (
      <EachResult
        onPress={() => handleLinkTouch(element.html_url)}
        key={element.id}>
        <RegularView>
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
        </RegularView>
      </EachResult>
    );
  };

  const renderHiddenItem = (data: SwipeList, rowMap: SwipeAbleMap) => (
    <RowBack>
      <BackLeftBtn onPress={() => bookmarkItem(rowMap, data.item)}>
        <Icon name="bookmarks-outline" size={30} color={platinum} />
      </BackLeftBtn>
      <BackRightBtn onPress={() => deleteRow(rowMap, data.item.id)}>
        <Icon name="trash-bin" size={30} color={platinum} />
      </BackRightBtn>
    </RowBack>
  );

  const auto_search = useCallback(
    (q: string) => {
      setLoading(true);
      setQuery(q);
      setPage(1);
      appState.setSearchResults([]);

      reload(q);
    },
    [appState, reload],
  );

  const Footer = () => (
    <CenteredView>
      {error !== '' ? (
        <IntroTxt>{error}</IntroTxt>
      ) : loadingMore ? (
        <ActivityIndicator color={platinum} />
      ) : null}
    </CenteredView>
  );

  const _onEndReached = useCallback(() => {
    if (appState.searchResults.length > 0) {
      setLoadingMore(true);
      console.log('Reached the end');
      setPage(page => page + 1);
      reload(query);
    }
  }, [appState.searchResults.length, query, reload]);

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
          <SwipeListView
            data={appState.searchResults}
            renderItem={_renderItem}
            onEndReached={_onEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => loadingMore && <Footer />}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-75}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          />
        ) : (
          <IntroTxt>Nothing To Report</IntroTxt>
        )}
      </LoadingContainer>
    </Container>
  );
}

export default Search;
