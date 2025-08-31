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
	variant?: 'default' | 'syncActivity';
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, leftElement, rightElement, variant = 'default' }) => {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const { headerHeight } = useResponsive();
	const styles = createStyles(insets, headerHeight, variant);

	return (
		<View style={[
			headerStyles.headerContainer, 
			styles.container,
			variant === 'syncActivity' && headerStyles.syncActivityHeader
		]}>
			<View style={[headerStyles.headerContent, styles.headerContent]}>
				<View style={[headerStyles.headerButtonContainer, styles.leftContainer]}>
					{leftElement}
				</View>
				<View style={[headerStyles.headerTitleContainer, styles.titleContainer]}>
					<Text 
						style={[
							variant === 'syncActivity' ? headerStyles.syncActivityTitle : headerStyles.headerTitle, 
							styles.title
						]} 
						numberOfLines={1}
					>
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

const createStyles = (insets: any, headerHeight: number, variant: string) => StyleSheet.create({
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
		fontSize: variant === 'syncActivity' 
			? Math.max(20, Math.min(24, headerHeight * 0.4)) // Larger font for sync activity
			: Math.max(18, Math.min(22, headerHeight * 0.35)), // Standard font size
	},
});

export { AppHeader };
