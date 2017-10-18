import React, { Component } from 'react';
import {
	Alert,
	AsyncStorage,
	ScrollView,
	Share,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Button,
} from 'react-native';

import { timeParse } from '../resource/js/helper';
import { secondary } from '../resource/js/styles';
import { ItemTypes, DeviceWidth, DeviceHeight, DefaultItems } from '../resource/js/globals';

export default class Records extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			items: [],
			bannerId: ''
		}
		
		this.initialState = this.initialState.bind(this);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}

	componentDidMount() {
		this.initialState();
		this.props.navigator.setButtons({
			leftButtons: [{
				id: 'settingsButton',
				icon: this.props.iconsMap['ios-build'],
			}],
			rightButtons: [{
				id: 'shareButton',
				icon: this.props.iconsMap['ios-share-alt'],
			}]
		});
	}

	initialState() {
		AsyncStorage.getItem("GoalTime:items").then((data) => {
			if (data && JSON.parse(data) instanceof Array) {
				let items = JSON.parse(data);

				this.setState({
					"items": items
				});
			} else {
				this.setState({
					"items": DefaultItems
				}, () => {
					AsyncStorage.setItem("GoalTime:items", JSON.stringify(DefaultItems));
				});
			}
		}).done();
		AsyncStorage.getItem("GoalTime:bannerId").then((data) => {
			if (data) {
				this.setState({
					bannerId: data
				});
			} else {
				this.setState({
					bannerId: 'dark'
				}, () => {
					AsyncStorage.setItem("GoalTime:bannerId", 'dark');
				});
			}
		}).done();
	}

	onNavigatorEvent(event) {
		switch(event.id) {
			case 'settingsButton':
				this.props.navigator.showLightBox({
					screen: "GoalTime.Settings",
					style: {
						backgroundBlur: 'light'
					},
					passProps: {
						iconsMap: this.props.iconsMap
					}
				});
				break;
			case 'shareButton':
				Share.share({
					message: '这里记录了我为实现目标所积累的时间',
					url: 'https://silentmaker.github.io/goaltime'
				});
				break;
			case 'willAppear':
				this.initialState();
				break;
		}
	}

	render() {
		const { items, bannerId } = this.state;
		const { iconsMap } = this.props;
		let totalTime = 0;

		return (
			<View>
				<View style={ styles.banner }>
				{bannerId == 'dark' && <Image source={ require('../resource/images/1.jpg') } style={ styles.bannerImage } />}
				{bannerId == 'modern' && <Image source={ require('../resource/images/2.jpg') } style={ styles.bannerImage } />}
				{bannerId == 'light' && <Image source={ require('../resource/images/3.jpg') } style={ styles.bannerImage } />}
				</View>
				<View style={ styles.containerWrap }>					
					<ScrollView contentContainerStyle={styles.container}>
						{items.map(item => {
							let itemTotalTime = 0;
							item.records.map(record => {
								itemTotalTime += record.time;
							});
							totalTime += itemTotalTime;

							return (
								<View key={ item.id } style={ styles.item }>
									<View style={ styles.itemHeader }>
										<Image source={ iconsMap[ItemTypes[item.type]] } style={ styles.icon } />
									</View>
									<View style={ styles.itemBody }>
										<Text style={ styles.title }>{ item.title }</Text>
										<Text style={ secondary }>总计时长：{ timeParse(itemTotalTime) }</Text>
									</View>
								</View>
							);
						})}
						{items.length == 0 &&
							<TouchableOpacity style={ styles.item } activeOpacity={ 0.8 } onPress={ () => {this.props.navigator.switchToTab({ tabIndex: 0 });} }>
								<View style={ styles.itemHeader }>
									<Image source={ iconsMap['ios-create'] } style={ styles.icon } />
								</View>
								<View style={ styles.itemBody }>
									<Text style={ styles.title }>暂无数据哦，快去设定目标吧~</Text>
								</View>
							</TouchableOpacity>
						}
					</ScrollView>
				</View>
				<View style={ styles.totalTime }>
					<Text style={ styles.totalCount }>{ timeParse(totalTime) }</Text>
					<Text style={ styles.totalInfo }>累计为目标付出时间</Text>
				</View>
			</View>
		);
	}
}

const BannerHeight = DeviceWidth * 0.6;

const styles = StyleSheet.create({
	banner: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: DeviceWidth,
		height: BannerHeight,
		shadowOffset: { height: 0, width: 0 },
		shadowRadius: 3,
		shadowColor: 'grey',
		shadowOpacity: 0.3,
	},
	bannerImage: {
		width: DeviceWidth,
		height: BannerHeight,
	},
	totalTime: {
		position: 'absolute',
		width: DeviceWidth,
		height: BannerHeight - 130,
		top: 60,
		left: 0,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	totalInfo: {
		fontSize: 14,
		color: 'white',
	},
	totalCount: {
		fontSize: 30,
		color: 'white',
		marginBottom: 8,
		textShadowColor: 'grey',
		textShadowRadius: 4,
	},
	containerWrap: {
		width: DeviceWidth - 20,
		height: DeviceHeight - BannerHeight + 60,
		position: 'absolute',
		top: BannerHeight - 60,
		left: 10,
		backgroundColor: '#FFF',
		shadowOffset: { height: 3, width: 0 },
		shadowRadius: 6,
		shadowColor: 'grey',
		shadowOpacity: 0.12,
		borderRadius: 4,
	},
	container: {
		paddingTop: 10,
		paddingBottom: 60,
	},
	item: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 4,
		marginLeft: 10,
		marginRight: 10,
		paddingTop: 14,
		paddingBottom: 14,
	},
	itemHeader: {
		width: 50,
		minHeight: 10,
		alignItems: 'center',
	},
	itemBody: {
		minHeight: 10,
		flexGrow: 1,
		flexShrink: 1,
		justifyContent: 'center',
	},
	itemFooter: {
		width: 50,
		minHeight: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#333',
		lineHeight: 20,
		fontSize: 16,
	},
	icon: {
		width: 20,
		height: 24
	}
});
