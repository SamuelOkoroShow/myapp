// Imports follow the format: external, shared, local
import React, {useCallback, useRef, useContext, useMemo, useState} from 'react';
import styled from 'styled-components/native';
import {SwipeRow} from 'react-native-swipe-list-view';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {debounce} from 'lodash';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Text,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';

// Share here
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
import {Graph} from '../../provider/types';
const {width} = Dimensions.get('window');

// Local styled components
const SearchBar = styled.TextInput`
  flex: 1;
  border-radius: 5px;
  background-color: ${forgra};
  font-size: 17px;
  padding-left: 17px;
  color: ${platinum};
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

const TouchableIcon = styled.TouchableOpacity`
  width: 50px;
  margin: 1px;
  justify-content: center;
  align-items: center;
`;

const SearchRow = styled.TouchableOpacity`
  flex-direction: row;
  height: 80px;
  border-color: ${shadow_blue};
  border-bottom-width: 1px;
`;

const Overlay = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: ${forgra};
`;

//let onBottomReachCounter = 0;
const per_page = 12;

// Uses the latest thrends in component creation and type declaration.
function Search({navigation}: StackScreenProps<{Bookmarks: any}>) {
  // Follows the format Memos, UseRef, UseStates, UseContexts, UseCallback, Render
  const dataProvider = useMemo(
    () =>
      new DataProvider((r1: any, r2: any) => {
        return r1 !== r2;
      }),
    [],
  );

  const swipeRowRef = useRef<any>(null);
  const textInputRef = useRef<any>(null);

  // All useState hooks
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const [loadingMore, setLoadingMore] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [resultCount, setResultCount] = useState<number>(0);
  const [recycledData, setRecycledData] = useState<any>(
    dataProvider.cloneWithRows([]),
  );

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

  // Recoomeded Link handling for React Native
  const handleLinkTouch = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  // Reusable API call.
  const reload = useCallback(
    (q: string, p: number) => {
      // We need data from Github
      const graphed = async () => {
        // because we can change search criteria
        const sorter = 'stars';
        const order = 'desc';
        try {
          const graph = await fetch(
            `https://api.github.com/search/repositories?q={${q}}&sort=${sorter}&order=${order}&per_page=${per_page}&page=${p}`,
          );

          // because the App needs to read a .json format
          const graphJson = await graph.json();

          // In case Github returns an error message
          if (graphJson.items) {
            setError('');
            // checking for page number
            if (p === 1) {
              setResultCount(graphJson.total_count);
              appState.setSearchResults([...graphJson.items]);
              setRecycledData(dataProvider.cloneWithRows([...graphJson.items]));
            } else {
              setLoadingMore(false);
              appState.setSearchResults([
                ...appState.searchResults,
                ...graphJson.items,
              ]);
              setRecycledData(
                dataProvider.cloneWithRows([
                  ...appState.searchResults,
                  ...graphJson.items,
                ]),
              );
            }
            setLoading(false);
          } else {
            setLoading(false);
            setError(graphJson.message);
            setLoadingMore(false);
          }
          if (graphJson.items.length === 0) {
            setLoading(false);
            setLoadingMore(false);
            setError('No avaiable repositories for this search');
          }
        } catch (err) {
          console.log(err.message);
        }
      };
      // Calling previously created async function.
      graphed();
    },
    [appState, dataProvider],
  );

  // Delete row option.
  const deleteRow = useCallback(
    (rowKey: number) => {
      // Reseting the json output locally.
      const newData = [...appState.searchResults];
      const prevIndex = appState.searchResults.findIndex(
        (item: Graph) => item.id === rowKey,
      );
      newData.splice(prevIndex, 1);
      appState.setSearchResults(newData);
      setRecycledData(dataProvider.cloneWithRows(newData));
      swipeRowRef.current.manuallySwipeRow(0);
    },
    [appState, dataProvider],
  );

  // Sends items to bookmarked store available at appState.bookmarks.
  const bookmarkItem = useCallback(
    (element: Graph) => {
      appState.setBookmarks([...appState.bookmarks, element]);
      deleteRow(element.id);
      swipeRowRef.current.closeRow();
      //console.log(swipeRowRef.current);
    },
    [appState, deleteRow],
  );

  // These get rendered behind renderItem.
  const RenderHiddenItem = (data: Graph) => (
    <RowBack>
      <BackLeftBtn onPress={() => bookmarkItem(data)}>
        <Icon name="bookmarks-outline" size={21} color={platinum} />
      </BackLeftBtn>
      <BackRightBtn onPress={() => deleteRow(data.id)}>
        <Icon name="trash-bin" size={21} color={platinum} />
      </BackRightBtn>
    </RowBack>
  );

  const _renderItem = (type: any, data: Graph) => {
    const element = data;

    return (
      <SwipeRow ref={swipeRowRef} leftOpenValue={75} rightOpenValue={-75}>
        <RenderHiddenItem {...data} />
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
      </SwipeRow>
    );
  };

  // Listener for keyboard pressed/search bar.
  const _search = useCallback(
    q => {
      setQuery(q);
      setLoading(true);
      setPage(1);
      appState.setSearchResults([]);

      reload(q, 1);
    },
    [appState, reload],
  );

  // Loading for error indicator for bottom of the list.
  const Footer = () => (
    <CenteredView>
      <ActivityIndicator color={platinum} />
    </CenteredView>
  );

  // Function for loading more api pages when user scrolls to the bottom of the list.
  const _onEndReached = useCallback(() => {
    // Preventative if statement here.
    //console.log(`end reached(${onBottomReachCounter})`);
    //onBottomReachCounter++;

    if (appState.searchResults.length > 0 && resultCount > per_page * page) {
      setLoadingMore(true);
      reload(query, page + 1);
      setPage(page + 1);
    }
  }, [appState.searchResults.length, page, query, reload, resultCount]);

  const _layoutProvider = new LayoutProvider(
    () => 80,
    (type: any, dim: {height: number; width: number}) => {
      dim.height = 80;
      dim.width = width;
    },
  );

  //const doYourThingDebounced = debounce(_search, 2000);

  const debounceHandler = useCallback(event => {
    setQuery(event);
    //doYourThingDebounced(event);
  }, []);

  return (
    <Container>
      <TopBar />
      <SearchRow>
        <SearchBar
          placeholder="Search GitHub..."
          value={query}
          ref={textInputRef}
          maxLength={35}
          onChangeText={debounceHandler}
          placeholderTextColor={platinum}
        />
        <TouchableIcon
          onPress={() => {
            setQuery('');
            textInputRef.current.clear();
          }}>
          <Icon name="close" size={20} color={platinum} />
        </TouchableIcon>
        <TouchableIcon onPress={_search}>
          <Icon name="search" size={20} color={platinum} />
        </TouchableIcon>
      </SearchRow>
      <LoadingContainer>
        {appState.searchResults.length > 0 ? (
          <RecyclerListView
            onEndReachedThreshold={0.3}
            renderFooter={Footer}
            onEndReached={_onEndReached}
            layoutProvider={_layoutProvider}
            dataProvider={recycledData}
            rowRenderer={_renderItem}
          />
        ) : null}
        {loading ? (
          <Overlay>
            <ActivityIndicator color={platinum} />
          </Overlay>
        ) : error !== '' ? (
          <IntroTxt>{error}</IntroTxt>
        ) : appState.searchResults.length <= 0 ? (
          <Overlay>
            <IntroTxt>Nothing To Report</IntroTxt>
          </Overlay>
        ) : null}
      </LoadingContainer>
    </Container>
  );
}

export default Search;
