import React, { Component } from 'react';
import {
	Alert,
	AsyncStorage,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	Button,
} from 'react-native';

import { DeviceWidth, DeviceHeight } from '../resource/js/globals';

export default class Timer extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			item: this.props.item,
			isActive: false,
			time: 0,
		}

		this.timer = '';

		this.startTiming = this.startTiming.bind(this);
		this.stopTiming = this.stopTiming.bind(this);
		this.cancelRecord = this.cancelRecord.bind(this);
		this.increaseTime = this.increaseTime.bind(this);
		this.saveRecord = this.saveRecord.bind(this);
	}

	startTiming() {
		this.setState({
			isActive: true
		});
		setTimeout(() => {
			this.increaseTime();
		}, 1000);
	}

	stopTiming() {
		this.setState({
			isActive: false
		});
		clearTimeout(this.timer);
	}

	cancelRecord() {
		if (this.state.time) {		
			Alert.alert('确认取消记时', '取消则不保存记录', [{
					text: '取消'
				}, {
					text: '确认',
					onPress: () => {
						this.stopTiming();
						this.setState({
							time: 0
						}, () => {
							this.props.navigator.dismissModal();
						});
					}
				}
			]);
		} else {
			this.stopTiming();
			this.setState({
				time: 0
			}, () => {
				this.props.navigator.dismissModal();
			});			
		}
	}

	increaseTime() {
		this.setState({
			time: ++this.state.time
		});
		if (this.state.isActive) {
			this.timer = setTimeout(() => {
				this.increaseTime();
			}, 1000);
		}
	}

	saveRecord() {
		this.stopTiming();
		AsyncStorage.getItem("GoalTime:items").then((data) => {
			if (this.state.time) {			
				let {item, time} = this.state;

				data = JSON.parse(data);
				data = data.map(target => {
					if (target.id == item.id) {
						target.records.unshift({
							time: this.state.time,
							date: new Date().getTime(),
						});
					}
					return target;
				});

				AsyncStorage.setItem("GoalTime:items", JSON.stringify(data));
			}
		}).done(() => {
			this.props.navigator.dismissModal();
		});
	}

	render() {
		const { iconsMap } = this.props;
		let {time, isActive} = this.state;
		let hh = '0' + parseInt(time / 3600);
		let mm = '0' + parseInt((time - hh * 3600) / 60);
		let ss = '0' + parseInt(time - hh * 3600 - mm * 60);

		return (
			<View style={styles.container}>
				<Text style={styles.timer}>
					{hh.slice(-2)}
					<Text style={{fontFamily: 'Helvetica'}}> : </Text>
					{mm.slice(-2)}
					<Text style={{fontFamily: 'Helvetica'}}> : </Text>
					{ss.slice(-2)}
				</Text>
				
				<View style={ styles.controlls }>					
					<TouchableOpacity style={ styles.button } 
						activeOpacity={ 0.8 } onPress={ this.saveRecord }>
						<Image source={ iconsMap['ios-checkmark-circle-outline'] } style={ styles.iconSave } />
					</TouchableOpacity>
					{isActive ? 
						<TouchableOpacity style={ styles.button } 
							activeOpacity={ 0.8 } onPress={ this.stopTiming }>
							<Image source={ iconsMap['ios-pause'] } style={ styles.iconPause } />
						</TouchableOpacity> : 
						<TouchableOpacity style={ styles.button } 
							activeOpacity={ 0.8 } onPress={ this.startTiming }>
							<Image source={ iconsMap['ios-play'] } style={ styles.iconPlay } />
						</TouchableOpacity>
					}
					<TouchableOpacity style={ styles.button } 
						activeOpacity={ 0.8 } onPress={ this.cancelRecord }>
						<Image source={ iconsMap['ios-close-circle-outline'] } style={ styles.iconCancel } />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: DeviceWidth,
		height: DeviceHeight,
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#333',
	},
	timer: {
		fontSize: 54,
		color: 'white',
		fontFamily: 'Courier',
		marginTop: DeviceHeight / 2 - 160,
	},
	controlls: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: DeviceWidth,
		height: 180,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	button: {
		width: 100,
		height: 100,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	iconPlay: {
		width: 44,
		height: 54,
		marginLeft: 8,
	},
	iconPause: {
		width: 34,
		height: 44,
	},
	iconSave: {
		width: 40,
		height: 40,
	},
	iconCancel: {
		width: 40,
		height: 40,
	}
});



