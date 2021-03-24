import styled from 'styled-components/native';
import {forgra, oxford, platinum, shadow_blue} from '../../colors';

export const Container = styled.View`
  background-color: ${oxford};
  flex: 1;
`;

export const IntroTxt = styled.Text`
  color: ${platinum};
  margin: 10px 0px 0px 20px;
  font-size: 15px;
`;

export const BarContainer = styled.View`
  height: 70px;
  flex-direction: row;
  border-radius: 5px;
  box-shadow: 0px 3px 3px;
`;
export const BarItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${oxford};
  border-bottom-width: 2px;
  border-bottom-color: ${forgra};
`;
export const BarActive = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${oxford};
  border-bottom-width: 2px;
  border-bottom-color: ${shadow_blue};
`;

export const TitleSection = styled.View`
  flex: 1;
  margin-left: 6px;
`;
export const ToggleBookmark = styled.TouchableOpacity`
  flex:3;
  flex-direction: row;
  border-bottom-width: 1px;
  border-color: ${shadow_blue}
  margin:3px;
  justify-content: center;
`;
export const ResultTitle = styled.Text`
  color: ${platinum};
  font-size: 15px;
`;

export const ResultStars = styled.Text`
  color: ${platinum};
  margin: 10px 0px 0px 20px;
  font-size: 15px;
`;

export const EachResult = styled.View`
  height: 80px;
  padding-top: 10px;
  border-radius: 5px;
  box-shadow: 0px 3px 3px;
  flex-direction: row;
  border-bottom-width: 1px;
  background-color: ${oxford};
  border-color: ${forgra};
`;

export const TitleHolder = styled.TouchableOpacity`
  flex: 7;
  flex-direction: row;
  padding-left: 5px;
  justify-content: center;
`;
export const Title = styled.Text`
  color: ${shadow_blue}
  font-size: 12px;
  font-weight:200;
`;
