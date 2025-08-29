import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AppHeaderProps {
	title?: string;
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, leftElement, rightElement }) => {
	const theme = useTheme();
	const styles = createStyles(theme);

	return (
		<View style={styles.container}>
			{!!leftElement && <View style={styles.left}>{leftElement}</View>}
			<Text style={styles.title} numberOfLines={1}>{title || ''}</Text>
			{!!rightElement && <View style={styles.right}>{rightElement}</View>}
		</View>
	);
};

const createStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
	container: {
		height: 60,
		backgroundColor: theme.colors.primary,
		color: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
		// Add shadow for consistency
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	left: {
		position: 'absolute',
		left: 16,
		zIndex: 1,
	},
	title: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		flex: 1,
	},
	right: {
		position: 'absolute',
		right: 16,
		zIndex: 1,
	},
});

export default AppHeader;
