import React, { Component } from 'react';
import Swipeout from 'react-native-swipeout';
import {
	Alert,
	AsyncStorage,
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity
} from 'react-native';

import { timeParse, dateParse } from '../resource/js/helper';
import { secondary } from '../resource/js/styles';
import { DeviceWidth, ItemTypes, BannerIds, DefaultItems } from '../resource/js/globals';

export default class Items extends Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			bannerId: '',
			rowId: '',
			swipeoutBtns: [],
		}

		this.startTimer = this.startTimer.bind(this);
		this.createItem = this.createItem.bind(this);
		this.editItem = this.editItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}

	componentDidMount() {
		// AsyncStorage.clear();
		this.initialState();
		this.props.navigator.setStyle({
			screenBackgroundColor: '#F0F1F5',
		});
		this.props.navigator.setButtons({
			leftButtons: [{
				id: 'shuffleBannerButton',
				icon: this.props.iconsMap['ios-shuffle'],
			}],
			rightButtons: [{
				id: 'addItemButton',
				icon: this.props.iconsMap['ios-add'],
			}]
		});
	}

	initialState() {
		AsyncStorage.getItem("GoalTime:items").then((data) => {
			if (data && JSON.parse(data) instanceof Array) {
				let items = JSON.parse(data);

				this.setState({
					items: items
				}, () => {
					items.length && this.initSwipoutButtons();
				});
			} else {
				this.setState({
					items: DefaultItems
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

	initSwipoutButtons() {
		this.setState({
			swipeoutBtns: [{
				backgroundColor: 'transparent',
				component: (
					<View style={ styles.swipeWrap }>
						<Image source={ this.props.iconsMap['ios-create'] } style={ styles.iconEdit } />
					</View>
				),
				onPress: this.editItem
			}, {
				backgroundColor: 'transparent',
				component: (
					<View style={ styles.swipeWrap }>
						<Image source={ this.props.iconsMap['ios-trash'] } style={ styles.iconTrash } />
					</View>
				),
				type: 'delete',
				onPress: this.deleteItem
			}]
		});
	}

	onNavigatorEvent(event) {
		switch (event.id) {
			case 'addItemButton':
				this.createItem();
				break;
			case 'shuffleBannerButton':
				let bannerId = BannerIds[Math.floor(Math.random() * 3)];

				this.setState({
					bannerId: bannerId
				}, () => {
					AsyncStorage.setItem("GoalTime:bannerId", bannerId);
				});
				break;
			case 'willAppear':
				this.initialState();
				break;
		}
	}

	startTimer(item) {
		this.props.navigator.showModal({
			screen: "GoalTime.Timer",
			title: "",
			passProps: {
				item: item,
				iconsMap: this.props.iconsMap
			}
		});
	}

	createItem() {
		this.props.navigator.push({
			title: '新增项目',
			screen: 'GoalTime.Item',
			passProps: {
				iconsMap: this.props.iconsMap,
				bannerId: this.state.bannerId
			}
		});
	}

	editItem() {
		let { items, rowId } = this.state;
		let item = items.filter(item => {
			return item.id == rowId;
		});

		this.props.navigator.push({
			title: '新增项目',
			screen: 'GoalTime.Item',
			passProps: {
				item: item[0],
				iconsMap: this.props.iconsMap
			}
		});
	}

	deleteItem() {
		const { items, rowId } = this.state;

		Alert.alert('确认删除', '项目删除后无法恢复', [{
				text: '取消'
			}, {
				text: '确认',
				onPress: () => {
					let newItems = items.filter(item => {
						return item.id != rowId;
					});
					this.setState({
						items: newItems
					}, () => {
						AsyncStorage.setItem("GoalTime:items", JSON.stringify(newItems));
					});
				}
			}
		]);
	}

	render() {
		let { items, swipeoutBtns, rowId, bannerId } = this.state;
		let { iconsMap } = this.props;
		let recordsCount = 0;

		return (
			<View>
				<ScrollView contentContainerStyle={ styles.container }>
				{items.map(item => {
					recordsCount += item.records.length;

					return (
					<Swipeout key={ item.id } style={ {backgroundColor: '#F0F1F5'} }
						close={ rowId != item.id }
						onOpen={ () => this.setState({rowId: item.id}) } 
						right={ swipeoutBtns } autoClose={ true }>
						<TouchableOpacity style={ styles.item } 
							activeOpacity={ 0.8 } onPress={ () => this.startTimer(item) }>
							<View style={ styles.itemHeader }>
								<Image style={ styles.iconBig } source={ iconsMap[ItemTypes[item.type]] } />
							</View>
							<View style={ styles.itemBody }>
								<Text style={ styles.title }>{ item.title }</Text>
								<Text style={ secondary }>
									<Image source={ iconsMap['ios-time'] } style={ styles.iconTime } />
									{ ' ' + (item.records[0] ? dateParse(item.records[0].date) : '未开始') + '     ' }
									<Image source={ iconsMap['ios-flag'] } style={ styles.iconFlag } />
									{ ' ' + item.records.length }
								</Text>
							</View>
							<View style={styles.itemFooter}>
								<Image source={ iconsMap['ios-arrow-round-forward'] } style={ styles.iconSmall } />
							</View>
						</TouchableOpacity>
					</Swipeout>
					);
				})}
				{items.length == 0 && 					
					<TouchableOpacity style={ styles.item } 
						activeOpacity={ 0.8 } onPress={ this.createItem }>
						<View style={ styles.itemHeader }>
							<Image style={ styles.iconBig } source={ iconsMap['ios-create'] } />
						</View>
						<View style={ styles.itemBody }>
							<Text style={ styles.emptyTip }>快给自己定下第一个小目标吧~</Text>
						</View>
					</TouchableOpacity>
				}
				</ScrollView>
				<View style={ styles.banner }>
					{bannerId == 'dark' && <Image source={ require('../resource/images/1.jpg') } style={ styles.bannerImage } />}
					{bannerId == 'modern' && <Image source={ require('../resource/images/2.jpg') } style={ styles.bannerImage } />}
					{bannerId == 'light' && <Image source={ require('../resource/images/3.jpg') } style={ styles.bannerImage } />}
				</View>
				<View style={ styles.projectCount } >
					<Text style={ styles.count }>{ items.length }</Text>
					<Text style={ styles.countInfo }>个目标</Text>
				</View>
				<View style={ styles.recordCount } >
					<Text style={ styles.count }>{ recordsCount }</Text>
					<Text style={ styles.countInfo }>次记时</Text>
				</View>
			</View>
		);
	}
}

const BannerHeight = DeviceWidth * 0.5;

const styles = StyleSheet.create({
	banner: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: DeviceWidth,
		height: BannerHeight,
		shadowOffset: { height: 3, width: 0 },
		shadowRadius: 3,
		shadowColor: 'grey',
		shadowOpacity: 0.3,
		backgroundColor: '#333',
	},
	bannerImage: {
		width: DeviceWidth,
		height: BannerHeight,
	},
	projectCount: {
		position: 'absolute',
		width: DeviceWidth / 2 - 10,
		height: BannerHeight - 60,
		top: 54,
		left: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	recordCount: {
		position: 'absolute',
		width: DeviceWidth / 2 - 10,
		height: BannerHeight - 60,
		top: 54,
		right: 10,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	count: {
		fontSize: 56,
		color: 'white',
		textShadowColor: 'grey',
		textShadowRadius: 4,
	},
	countInfo: {
		fontSize: 13,
		color: 'white',
	},
	container: {
		backgroundColor: '#F0F1F5',
		paddingTop: BannerHeight + 10,
		paddingBottom: 10,
	},
	item: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 5,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		paddingTop: 14,
		paddingBottom: 14,
		backgroundColor: '#FFFFFF',
		shadowOffset: { height: 3, width: 3 },
		shadowRadius: 3,
		shadowColor: 'grey',
		shadowOpacity: 0.08,
		borderRadius: 2,
	},
	itemHeader: {
		width: 56,
		minHeight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#EFEFEF',
		borderRightWidth: 0.5,
		borderStyle: 'solid',
		marginRight: 14,
	},
	itemBody: {
		minHeight: 10,
		flexGrow: 1,
		flexShrink: 1,
		justifyContent: 'center',
	},
	itemFooter: {
		width: 48,
		minHeight: 10,
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: '#333',
		lineHeight: 24,
		fontSize: 18,
		marginBottom: 6,
	},
	iconBig: {
		width: 24,
		height: 24,
	},
	iconSmall: {
		width: 18,
		height: 18,
	},
	iconTime: {
		width: 11,
		height: 12,
		marginTop: 2,
	},
	iconFlag: {
		width: 10,
		height: 10,
		marginTop: 1,
	},
	swipeWrap: {
		marginTop: 10,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconEdit: {
		width: 20,
		height: 20,
	},
	iconTrash: {
		width: 16,
		height: 21
	},
	emptyTip: {
		fontSize: 16,
		color: '#2F68A7',
	}
});
