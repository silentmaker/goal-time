import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
const Icon = require('react-native-vector-icons/Ionicons');

import { registerPages } from './pages';

let icons = [
	{ name: 'ios-archive', size: 28, color: '#bbb' },
	{ name: 'ios-medal', size: 23, color: '#bbb' },
	{ name: 'ios-build', size: 22, color: '#bbb' },
	{ name: 'ios-share-alt', size: 26, color: '#bbb' },
	{ name: 'ios-shuffle', size: 30, color: '#bbb' },
	{ name: 'ios-add', size: 36, color: '#bbb' },
	{ name: 'ios-create', size: 23, color: '#A2B4B9' },
	{ name: 'ios-trash', size: 23, color: '#EA4236' },
	{ name: 'ios-time', size: 24, color: '#A2B4B9' },
	{ name: 'ios-flag', size: 24, color: '#A2B4B9' },
	{ name: 'ios-arrow-round-forward', size: 32, color: '#A2B4B9' },
	{ name: 'ios-play', size: 48, color: '#fff' },
	{ name: 'ios-pause', size: 48, color: '#fff' },
	{ name: 'ios-close-outline', size: 48, color: '#A2B4B9' },
	{ name: 'ios-close-circle-outline', size: 48, color: '#fff' },
	{ name: 'ios-checkmark-circle-outline', size: 48, color: '#fff' },
	{ name: 'ios-mail', size: 48, color: '#AAB8A4' },
	{ name: 'ios-thumbs-up', size: 24, color: '#A2B4B9' },
	{ name: 'ios-cloud-download', size: 48, color: '#82C2D4' },
	{ name: 'ios-game-controller-b', size: 48, color: "#EA606C" },
	{ name: 'ios-basketball', size: 48, color: "#DF813D" },
	{ name: 'ios-plane', size: 48, color: "#82C2D4" },
	{ name: 'ios-book', size: 48, color: "#AAB8A4" },
	{ name: 'ios-color-palette', size: 48, color: "#E9AE71" },
	{ name: 'ios-chatboxes', size: 48, color: "#23AFB7" },
	{ name: 'ios-car', size: 48, color: "#2F68A7" },
	{ name: 'ios-paper', size: 48, color: "#1E9376" },
	{ name: 'ios-hammer', size: 48, color: "#5F8579" },
	{ name: 'ios-school', size: 48, color: "#01343F" },
	{ name: 'ios-star', size: 48, color: "#FFE968" },
	{ name: 'ios-camera', size: 48, color: "#8192D3" },
	{ name: 'ios-beer', size: 48, color: "#EA606C" },
	{ name: 'ios-briefcase', size: 48, color: "#82ABB9" },
	{ name: 'ios-heart', size: 48, color: "#EA4236" },
	{ name: 'ios-cafe', size: 48, color: "#A25120" }
];
let iconsMap = {};

registerPages();

export default class App {
	constructor() {
		this.generateIcons().then(() => {
			this.startApp();
		}).catch((error) => {
			console.error(error);
		});
	}

	generateIcons() {
		return new Promise(function (resolve, reject) {
			Promise.all(icons.map(icon => {
				return Icon.getImageSource(icon.name, icon.size, icon.color);
			})).then(sources => {
				icons = icons.map((icon, index) => {
					iconsMap[icon.name] = sources[index];
					return icon;
				});
				resolve(true);
			}).catch((error) => {
				console.log(error);
				reject(error);
			}).done();
		});
	}

	startApp() {
		Navigation.startTabBasedApp({
			tabs: [{
				label: '目标列表',
				title: '目标列表',
				screen: 'GoalTime.Items',
				icon: iconsMap['ios-archive']
			},{
				label: '时间统计',
				title: '时间统计',
				screen: 'GoalTime.Records',
				icon: iconsMap['ios-medal']
			}],
			appStyle: {
				orientation: 'portrait',
				hideBackButtonTitle: false,
				navBarTextFontSize: 18,
				navBarButtonColor: 'white',
				navBarTextColor: 'white',
				navBarNoBorder: true,
				navBarBackgroundColor: 'white',
				drawUnderNavBar: true,
				navBarTransparent: true,
				navBarTranslucent: true,
				screenBackgroundColor: 'white',
				statusBarTextColorScheme: 'light'
			},
			tabsStyle: {
				tabBarButtonColor: '#999',
				tabBarSelectedButtonColor: 'steelblue',
				tabBarBackgroundColor: '#ffffff',
				tabBarHideShadow: true,
				tabBarBackgroundColor: '#010203',
				tabBarButtonColor: '#999',
				tabBarSelectedButtonColor: '#ffffff',
				tabBarLabelColor: '#999',
				tabBarSelectedLabelColor: '#ffffff'
			},
			passProps: {
				iconsMap: iconsMap
			}
		});
	}
}