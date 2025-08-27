import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AppHeaderProps {
	title?: string;
	rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, rightElement }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title} numberOfLines={1}>{title || ''}</Text>
			{!!rightElement && <View style={styles.right}>{rightElement}</View>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 60,
		backgroundColor: '#2563eb',
		color: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	title: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
	},
	right: {
		position: 'absolute',
		right: 16,
	},
});

export default AppHeader;
