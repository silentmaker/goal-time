import React, { Component } from 'react';
import {
	Alert,
	AsyncStorage,
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	Button,
} from 'react-native';

import { DeviceWidth, ItemTypes } from '../resource/js/globals';

export default class Item extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			item: this.props.item ? Object.assign({}, this.props.item) : {
				title: '',
				type: 'learn',
			},
			bannerId: this.props.bannerId || 'dark'
		}

		this.onChangeText = this.onChangeText.bind(this);
		this.onChangeType = this.onChangeType.bind(this);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
	}

	componentWillMount() {
		this.props.navigator.toggleTabs({
			to: 'hidden',
			animated: true
		});
		this.props.navigator.setButtons({
			rightButtons: [{
				id: 'saveItemButton',
				title: '保存',
			}]
		});
		this.props.navigator.setStyle({
			screenBackgroundColor: 'white'
		});
	}

	componentWillUnmount() {
		this.props.navigator.toggleTabs({
			to: 'shown',
			animated: true
		});
	}

	onNavigatorEvent(event) {
		if(event.type == 'NavBarButtonPress') {
			if(event.id == 'saveItemButton') {
				let {item} = this.state;

				if (item.title) {
					AsyncStorage.getItem("GoalTime:items").then((data) => {
						data = JSON.parse(data);
						if (item.id) {
							data = data.map(target => {
								return target.id == item.id  ? Object.assign(target, item) : target;
							});
						} else {
							item.id = new Date().getTime();
							item.records = [];
							data.unshift(item);
						}
						AsyncStorage.setItem("GoalTime:items", JSON.stringify(data));
					}).done(() => {
						this.props.navigator.popToRoot({
							animated: true
						});
					});
				} else {
					Alert.alert('请输入项目名称');
				}
			}
		}
	}

	onChangeText(text) {
		this.setState({
			item: Object.assign(this.state.item, {
				title: text
			})
		});
	}

	onChangeType(type) {
		this.setState({
			item: Object.assign(this.state.item, {
				type: type
			})
		});
	}

	render() {
		const types = Object.keys(ItemTypes);
		const { item, bannerId } = this.state;
		const { iconsMap } = this.props;

		return (
			<View style={styles.container}>
				<TextInput
					style={styles.titleInput}
					placeholder="项目名称"
					onChangeText={this.onChangeText}
					value={this.state.item.title} />

				<View style={styles.typeContainer}>
				{types.map((type, index) => 
					<TouchableOpacity key={ index } style={ item.type == type ? styles.iconTypeSelected : styles.itemType } 
						activeOpacity={ 0.8 } onPress={ () => { this.onChangeType(type) } }>
						<View style={ styles.iconWrap }>
							<Image style={ styles.typeIcon } source={ iconsMap[ItemTypes[type]] } />
						</View>
					</TouchableOpacity>
				)}
				</View>
				<View style={ styles.banner }>
				{bannerId == 'dark' && <Image source={ require('../resource/images/1.jpg') } style={ styles.bannerImage } />}
				{bannerId == 'modern' && <Image source={ require('../resource/images/2.jpg') } style={ styles.bannerImage } />}
				{bannerId == 'light' && <Image source={ require('../resource/images/3.jpg') } style={ styles.bannerImage } />}
				</View>
			</View>
		);
	}
}

const BannerHeight = DeviceWidth * 0.32;

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
	},
	bannerImage: {
		width: DeviceWidth,
		height: BannerHeight,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		paddingTop: BannerHeight,
	},
	titleInput: {
		width: 260,
		fontSize: 20,
		lineHeight: 24,
		padding: 8,
		textAlign: 'center',
		marginTop: 40,
		marginBottom: 20,
		borderStyle: 'solid',
		borderBottomWidth: 1,
		borderColor: '#A2B4B9',
	},
	typeContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		width: 260,
		height: 260,
	},
	itemType: {
		width: 65,
		height: 65,
	},
	iconTypeSelected: {
		width: 65,
		height: 65,
		backgroundColor: '#EFEFEF',
	},
	iconWrap: {
		width: 65,
		height: 65,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	typeIcon: {
		width: 24,
		height: 24,
	}
});
