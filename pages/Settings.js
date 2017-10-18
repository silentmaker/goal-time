import React, { Component } from 'react';
import {
	Alert,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Button,
} from 'react-native';
import Mailer from 'react-native-mail';

import { DeviceWidth, DeviceHeight } from '../resource/js/globals';

export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.handleFeedback = this.handleFeedback.bind(this);
	}

	handleFeedback() {
		Mailer.mail({
			subject: '意见反馈',
			recipients: ['demonmaxc@gmail.com'],
			isHTML: true,
		}, (error, event) => {
			Alert.alert('打开邮件出错了!');
		});
		this.props.navigator.dismissLightBox();
	}

	render() {
		const { iconsMap } = this.props;

		return (
			<View style={styles.container}>
				<TouchableOpacity style={ styles.closeButton } 
					activeOpacity={ 0.8 } onPress={ () => { this.props.navigator.dismissLightBox(); } }>
					<Image source={ iconsMap['ios-close-outline'] } style={ styles.iconClose } />
				</TouchableOpacity>
				<View style={ styles.buttonContainer }>
					<TouchableOpacity style={ styles.buttonWrap } 
						activeOpacity={ 0.8 } onPress={ () => { this.props.navigator.dismissLightBox(); } }>
						<Image source={ iconsMap['ios-cloud-download'] } style={ styles.iconCloud } />
						<Text style={styles.buttonInfo}>iCloud同步</Text>
					</TouchableOpacity>
					<TouchableOpacity style={ styles.buttonWrap } 
						activeOpacity={ 0.8 } onPress={ this.handleFeedback }>
						<Image source={ iconsMap['ios-mail'] } style={ styles.iconMail } />
						<Text style={styles.buttonInfo}>意见反馈</Text>
					</TouchableOpacity>
					<TouchableOpacity style={ styles.buttonWrap } 
						activeOpacity={ 1 } onPress={ () => {} }>
						<Image source={ iconsMap['ios-thumbs-up'] } style={ styles.iconThumb } />
						<Text style={styles.buttonTip}>记得给个好评哦</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		width: DeviceWidth * 0.75,
		height: DeviceWidth,
		borderRadius: 4,
		shadowOffset: { height: 2, width: 0 },
		shadowRadius: 4,
		shadowColor: 'grey',
		shadowOpacity: 0.1,
	},
	closeButton: {
		position: 'absolute',
		top: 6,
		right: 4,
		width: 18,
		height: 18,
		margin: 10,
	},
	iconClose: {
		width: 18,
		height: 18,
	},
	buttonContainer: {
		height: DeviceWidth - 100,
		marginTop: 80,
	},
	buttonWrap: {
		width: DeviceWidth * 0.75,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonInfo: {
		fontSize: 18,
		color: '#333',
		marginLeft: 24,
	},
	buttonTip: {
		fontSize: 16,
		color: '#A2B4B9',
		marginLeft: 10,
	},
	iconCloud: {
		width: 48,
		height: 48,
	},
	iconMail: {
		width: 42,
		height: 42,
	},
	iconThumb: {
		width: 18,
		height: 18,
	}
});
