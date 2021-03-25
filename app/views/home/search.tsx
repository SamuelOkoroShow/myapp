// Required Libraries
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator, Alert, Linking, Text} from 'react-native';

// StackScreenProps is a type
import {StackScreenProps} from '@react-navigation/stack';

// Share components
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

// Local styled components
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

// React Fuctional Component.
function Search({navigation}: StackScreenProps<{Bookmarks: any}>) {
  // All useState hooks
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [loadingMore, setLoadingMore] = useState<Boolean>(true);
  const [page, setPage] = useState<number>(1);

  // All useContext hooks
  const appState = useContext(AppProviderContext);

  // Tempurary TopBar to replicate MaterialTopTabs
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

  // Routing to best app for opening link function.
  const handleLinkTouch = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  // Delete row option.
  const deleteRow = useCallback(
    (rowMap: SwipeAbleMap, rowKey: number) => {
      if (rowMap[rowKey]) {
        // Inbuilt .closeRow() function for SwipeListView
        rowMap[rowKey].closeRow();
      }
      // Reseting the json output locally.
      const newData = [...appState.searchResults];
      const prevIndex = appState.searchResults.findIndex(
        (item: Graph) => item.id === rowKey,
      );
      newData.splice(prevIndex, 1);
      appState.setSearchResults(newData);
    },
    [appState],
  );

  // Called every keyboard press or end-of-list reached.
  const reload = useCallback(
    (q: string) => {
      // Init async fuction for Githb's database call.
      const graphed = async () => {
        // sorting and ordering via local variables
        const sorter = 'stars';
        const order = 'desc';
        // making the api call...
        const graph = await fetch(
          `https://api.github.com/search/repositories?q={${q}}&sort=${sorter}&order=${order}&per_page=20&page=${page}`,
        );
        // seperate await call for .json.
        const graphJson = await graph.json();
        // checking for known Github api errors
        if (graphJson.items) {
          setError('');
          // checking for page number
          if (page === 1) {
            appState.setSearchResults([...graphJson.items]);
          } else {
            setLoadingMore(false);
            // including additional pages to the end of the list/appState.searchResults.
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
      // Calling previously created async function.
      graphed();
    },
    [appState, page],
  );

  // Sends items to bookmarked store available at appState.bookmarks.
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

  // These get rendered behind renderItem.
  const renderHiddenItem = (data: SwipeList, rowMap: SwipeAbleMap) => (
    <RowBack>
      <BackLeftBtn onPress={() => bookmarkItem(rowMap, data.item)}>
        <Icon name="bookmarks-outline" size={21} color={platinum} />
      </BackLeftBtn>
      <BackRightBtn onPress={() => deleteRow(rowMap, data.item.id)}>
        <Icon name="trash-bin" size={21} color={platinum} />
      </BackRightBtn>
    </RowBack>
  );

  // Listener for keyboard pressed/search bar.
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

  // Loading for error indicator for bottom of the list.
  const Footer = () => (
    <CenteredView>
      {error !== '' ? (
        <IntroTxt>{error}</IntroTxt>
      ) : loadingMore ? (
        <ActivityIndicator color={platinum} />
      ) : null}
    </CenteredView>
  );

  // Function for loading more api pages when user scrolls to the bottom of the list.
  const _onEndReached = useCallback(() => {
    // Preventative if statement here.
    if (appState.searchResults.length > 0) {
      setLoadingMore(true);
      // Updages page and uses aync fetch method.
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
