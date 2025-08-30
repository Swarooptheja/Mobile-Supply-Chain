import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { headerStyles, headerColors, headerSpacing } from '../styles/header.styles';

interface AppHeaderProps {
	title?: string;
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, leftElement, rightElement }) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { headerHeight } = useResponsive();
	const styles = createStyles(insets, headerHeight);

	return (
		<View style={[headerStyles.headerContainer, styles.container]}>
			<View style={[headerStyles.headerContent, styles.headerContent]}>
				<View style={[headerStyles.headerButtonContainer, styles.leftContainer]}>
					{leftElement}
				</View>
				<View style={[headerStyles.headerTitleContainer, styles.titleContainer]}>
					<Text style={[headerStyles.headerTitle, styles.title]} numberOfLines={1}>
						{title || ''}
					</Text>
				</View>
				<View style={[headerStyles.headerButtonContainer, styles.rightContainer]}>
					{rightElement}
				</View>
			</View>
		</View>
	);
};

const createStyles = (insets: any, headerHeight: number) => StyleSheet.create({
	container: {
		paddingTop: insets.top > 0 ? insets.top + 8 : 20, // Reduced padding for compact look
	},
	headerContent: {
		minHeight: Math.max(56, headerHeight * 0.7), // Reduced height for better proportions
	},
	leftContainer: {
		flex: 0, // Fixed width for left container
		alignItems: 'flex-start',
		justifyContent: 'center',
		minWidth: headerSpacing.buttonSize, // Use consistent button size
	},
	titleContainer: {
		flex: 1, // Take remaining space
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 8, // Minimal padding
	},
	rightContainer: {
		flex: 0, // Fixed width for right container
		alignItems: 'flex-end',
		justifyContent: 'center',
		minWidth: headerSpacing.buttonSize, // Use consistent button size
	},
	title: {
		fontSize: Math.max(18, Math.min(22, headerHeight * 0.35)), // Responsive font size
	},
});

export default AppHeader;
