import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AppHeaderProps {
	title?: string;
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, leftElement, rightElement }) => {
	return (
		<View style={styles.container}>
			{!!leftElement && <View style={styles.left}>{leftElement}</View>}
			<Text style={styles.title} numberOfLines={1}>{title || ''}</Text>
			{!!rightElement && <View style={styles.right}>{rightElement}</View>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 60,
		backgroundColor: '#1e3a8a',
		color: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	left: {
		position: 'absolute',
		left: 16,
	},
	title: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: 'bold',
	},
	right: {
		position: 'absolute',
		right: 16,
	},
});

export default AppHeader;
