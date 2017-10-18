import { Dimensions } from 'react-native';


const { height, width } = Dimensions.get('window');
const DeviceWidth = width;
const DeviceHeight = height;

const ItemTypes = {
	learn: "ios-school",
	sport: "ios-basketball",
	travel: "ios-plane",
	read: "ios-book",
	art: "ios-color-palette",
	chat: "ios-chatboxes",
	car: "ios-car",
	write: "ios-paper",
	work: "ios-hammer",
	game: "ios-game-controller-b",
	camera: "ios-camera",
	meet: "ios-beer",
	business: "ios-briefcase",
	cafe: "ios-cafe",
	love: "ios-heart",
	star: "ios-star",
};

const BannerIds = ['dark', 'light', 'modern'];

const now = new Date();
const DefaultItems = [{
	id: now.getTime(),
	title: '看书',
	type: 'learn',
	records: []
}, {
	id: now.getTime() + 1,
	title: '写作',
	type: 'write',
	records: []
}, {
	id: now.getTime() + 2,
	title: '健身',
	type: 'sport',
	records: []
}]

export {
	DeviceWidth,
	DeviceHeight,
	ItemTypes,
	BannerIds,
	DefaultItems
};