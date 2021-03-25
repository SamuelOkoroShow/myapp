import styled from 'styled-components/native';
import {
  bdazzled,
  forgra,
  oxford,
  platinum,
  shadow_blue,
  tomato,
} from '../../colors';

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

export const BackRightBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 75px;
  position: absolute;
  bottom: 0px;
  top: 0px;
  right: 0px;
  background-color: ${bdazzled};
`;

export const WhiteText = styled.Text`
  color: ${platinum}
  font-size: 12px;
`;
export const BackLeftBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 75px;
  bottom: 0px;
  top: 0px;
  left: 0;
  position: absolute;
  background-color: ${tomato};
`;
export const RowBack = styled.TouchableOpacity`
  align-items: center;
  background-color: ${oxford};
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

export const ToggleBookmark = styled.TouchableOpacity`
  flex:3;
  flex-direction: row;
  border-bottom-width: 1px;
  border-color: ${shadow_blue}
  margin:3px 3px 0px;
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

export const EachResult = styled.TouchableOpacity`
  height: 80px;
  padding-top: 10px;
  border-radius: 0px;
  box-shadow: 0px 3px 3px;
  flex-direction: row;
  border-bottom-width: 1px;
  background-color: ${oxford};
  border-color: ${forgra};
`;

export const TitleHolder = styled.View`
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
