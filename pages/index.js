import { Navigation } from 'react-native-navigation';

import Items from './Items';
import Item from './Item';
import Records from './Records';
import Settings from './Settings';
import Timer from './Timer';

export function registerPages() {
	Navigation.registerComponent('GoalTime.Items', () => Items);
	Navigation.registerComponent('GoalTime.Item', () => Item);
	Navigation.registerComponent('GoalTime.Records', () => Records);
	Navigation.registerComponent('GoalTime.Settings', () => Settings);
	Navigation.registerComponent('GoalTime.Timer', () => Timer);
}