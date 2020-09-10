import React, { useState, useEffect, createRef, useRef } from "react";
import { Dimensions, StyleSheet, View, Image, Text } from "react-native";
import { TaiyakiImage } from "./taiyaki_view";
import Video from "react-native-video-controls";
import { useNavigation } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import BottomSheet from "reanimated-bottom-sheet";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";

const publicTestLink =
	"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const TaiyakiVideoPlayer = () => {
	//const playerController = createRef<Video>();
	const navigation = useNavigation();
	const theme = useTheme();

	const upNextSheet = createRef<BottomSheet>();
	const videoPlayerController = createRef<Video>();
	const [isFullscreen, toggleFullScreen] = useState<boolean>(false);

	const [isVisible, setIsVisible] = useState<boolean>(true);

	useEffect(() => {
		return () => {
			toggleFullScreen(false);
		};
	}, []);

	const _shownControls = () => {
		console.log("showing controls");
		setIsVisible(true);
		if (isFullscreen) {
			upNextSheet.current?.snapTo(1);
		}
	};

	const _onHideControls = () => {
		console.log("hiding controls");
		setIsVisible(false);
		upNextSheet.current?.snapTo(1);
	};

	useEffect(() => {
		if (isFullscreen) Orientation.lockToLandscape();
		else Orientation.lockToPortrait();
		return () => Orientation.lockToAllOrientationsButUpsideDown();
	}, [isFullscreen]);

	const renderQueue = ({ item, index }: { item: number; index: number }) => {
		return (
			<View
				style={{
					height: Dimensions.get("window").height * 0.45,
					width: Dimensions.get("window").width * 0.3,
					marginLeft: index === 0 ? Dimensions.get("window").width * 0.15 : 15,
					paddingVertical: 5,
				}}>
				<Image
					source={{
						uri:
							"https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21459-oZMZ7JwS5Sxq.jpg",
					}}
					style={[
						styles.upNextImage,
						{
							borderColor: theme.colors.primary,
							borderWidth: index === 0 ? 1 : 0,
						},
					]}
				/>
				<LinearGradient
					colors={[
						"rgba(0, 0, 0, 0.7)",
						"rgba(0,0,0,0.5)",
						"rgba(0,0,0,0.25)",
					]}>
					<View style={{ paddingHorizontal: 4 }}>
						<View style={{ flexDirection: "row" }}>
							<Text numberOfLines={1} style={styles.upNextEpTitle}>
								There is always a second chance
							</Text>
						</View>
						<Text numberOfLines={1} style={styles.upNextTitle}>
							Boku no Academia
						</Text>
					</View>
				</LinearGradient>
			</View>
		);
	};

	return (
		<View
			style={[
				isFullscreen ? styles.fullScreen : styles.notFullScreen,
				{ backgroundColor: "black" },
			]}>
			<Video
				navigator={navigation}
				paused={true}
				ignoreSilentSwitch={"ignore"}
				showOnStart={false}
				style={{ height: "100%", width: "100%" }}
				ref={videoPlayerController}
				source={{ uri: publicTestLink }}
				disableBack
				toggleResizeModeOnFullscreen={false}
				onEnterFullscreen={() => toggleFullScreen(true)}
				onExitFullscreen={() => toggleFullScreen(false)}
				onShowControls={_shownControls}
				onHideControls={_onHideControls}
				scrubbing={500}
				controlTimeout={50000000000}
				onFastRewind={() => console.log("rewinding 10s")}
				onFastForward={() => console.log("ffs 10s")}
			/>
			{isFullscreen && (
				<TouchableOpacity
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.45)",
					}}
					onPress={() => setIsVisible(false)}
				/>
			)}
			{isFullscreen && isVisible && (
				<BottomSheet
					ref={upNextSheet}
					initialSnap={1}
					snapPoints={["25%", "3%"]}
					renderContent={() => (
						<View
							style={{
								width: "100%",
								height: Dimensions.get("window").height * 0.55,
							}}>
							<FlatList
								showsHorizontalScrollIndicator={false}
								horizontal
								data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
								renderItem={renderQueue}
								keyExtractor={(_, index) => String(index)}
							/>
						</View>
					)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	fullScreen: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 0,
	},
	notFullScreen: {
		width: "100%",
		position: "relative",
		height: Dimensions.get("window").height * 0.3,
		alignContent: "center",
		alignItems: "center",
	},
	//Aspect Ratio required
	innerView: {
		height: "100%",
		width: "100%",
	},

	upNextImage: {
		height: "80%",
		width: "100%",
		borderRadius: 4,
		marginBottom: 5,
	},
	upNextTitle: {
		color: "white",
		fontWeight: "300",
		fontSize: 12,
	},
	upNextEpTitle: {
		flexShrink: 0.8,
		fontSize: 14,
		fontWeight: "500",
		color: "white",
	},
});

export default TaiyakiVideoPlayer;
