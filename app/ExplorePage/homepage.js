//TODO: 
// - Link hero to collection

'use strict';

var React = require('react-native');
var {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	ScrollView,
	Image,
} = React;
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Spinner = require('react-native-spinkit');

var Swiper = require('react-native-swiper')
var EachDetail = require('../components/EachDetail.js');
var CommentItem = require('../components/CommentItem.js');
var EachTag = require('../components/EachTag.js');
var CollectionItem = require('../components/CollectionItem.js');
var CollectionList = require('../components/CollectionList.js');
var GridView = require("../components/GridView.js");


var globalStyles = require("../globalStyles.js");

var Hero = React.createClass({
	render: function() {
		var uri = this.props.data.coverImage.url();
		return (
				<Image
					style={styles.heroContainer}
					source={{uri: uri}}
					>
				<View style={styles.heroBorder}>
					<Text style={[globalStyles.text.heading, globalStyles.text.size.large]}>
						{this.props.data.name.toUpperCase()}
					</Text>
					<Text style={[globalStyles.text.roman, {marginTop: -5}]}>
						{this.props.data.description}
					</Text>
				</View>
			</Image>
		);
	}
});

var Homepage = React.createClass({
	mixins: [ParseReact.Mixin],
	observe: function(props, state) {
		var tagQuery = new Parse.Query('Tag')
			.ascending("text")
			.limit(10);

		var collectionQuery = new Parse.Query('Collection')
			.ascending("text")
			.limit(5);

		var heroCollectionQuery = new Parse.Query('Collection')
			.exists('heroItem')
			.ascending('createdAt')
			.limit(3);

		var featuredCollectionQuery = new Parse.Query('Collection')
			.exists('featuredItem')
			.ascending('createdAt')
			.limit(5);

		return { 
			tags: tagQuery,
			collection: collectionQuery,
			heroCollection: heroCollectionQuery,
			featuredCollection: featuredCollectionQuery
		};
	},
	render: function() {

		var passiveDot = <View style={[styles.dot, {borderWidth: 1}]} />;
		var activeDot = <View style={[styles.dot, {backgroundColor: 'rgba(0,0,0,1)'}]} />;

		console.log(this.data.heroCollection)
		return (
			<ScrollView style={styles.container} contentInset={{bottom: 80,}} automaticallyAdjustContentInsets={false}>
				<Swiper dot={passiveDot} activeDot={activeDot} height={145} showPagination={true} autoplay={true}>
					{this.data.heroCollection && this.data.heroCollection.length > 0 ?
						this.data.heroCollection.map((collection, i) => <Hero key={i} data={collection}/>) :
						<View style={[globalStyles.loadingSpinner]}>
							<Spinner isVisible={true} size={50} type='Arc' color='#000'/>
						</View>
					}
				</Swiper>

				<EachDetail heading={true}>
					<Text style={globalStyles.text.roman}>Explore Trending Tags</Text>
				</EachDetail>
				<ScrollView horizontal={true} style={styles.tagsList}>
					{this.data.tags && this.data.tags.length > 0 ? 
						this.data.tags.map(
							(tag, i) => 
							<EachTag key={i} tag={tag} large={true} toRoute={this.props.toRoute}/>)
						:
						<View style={[globalStyles.loadingSpinner]}>
							<Spinner isVisible={true} size={50} type='Arc' color='#000'/>
						</View>
					}
				</ScrollView>

				<EachDetail heading={true}>
					<Text style={globalStyles.text.roman}>Featured Collections</Text>
				</EachDetail>
				<ScrollView directionalLockEnabled={true} style={styles.collectionList} horizontal={true} >
					{this.data.featuredCollection && this.data.featuredCollection.length > 0 ? 
						this.data.featuredCollection.map(
							(collection,i) => 
								<CollectionItem key={i} data={collection} replaceRoute={this.props.replaceRoute} toRoute={this.props.toRoute} style={{marginRight: 10,}} toBack={this.props.toBack}/>
							)
						: 
						<View style={[globalStyles.loadingSpinner]}>
							<Spinner isVisible={true} size={50} type='Arc' color='#000'/>
						</View>
						
					}
				</ScrollView>

				<EachDetail heading={true}>
					<Text style={globalStyles.text.roman}>Explore Latest Questions</Text>
				</EachDetail>
				<GridView type="latestQuestions" toRoute={this.props.toRoute}/>

				<EachDetail heading={true}>
					<Text style={globalStyles.text.roman}>Explore Latest Collections</Text>
				</EachDetail>
				<CollectionList query={{limit: 5, descending: 'updatedAt'}} toRoute={this.props.toRoute} toBack={this.props.toBack}/>

				{/*
				<EachDetail heading={true}>
					<Text style={globalStyles.text.roman}>Explore latest questions</Text>
				</EachDetail>
				{comments.map(
					(comment, i) => 
					<CommentItem 
						key={i}
						visibleUser={false} 
						visibleComment={true} 
						data={comment} />
					)
				}
				*/}

			</ScrollView>
		);
	}
});


var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',	
	},
	heroContainer: {
		width: width,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
	},
	heroBorder: {
		flex: 1,
		width: width - 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,.4)',
		margin: 20,
	},
	dot: {
		width: 8, 
		height: 8,
		borderRadius: 4, 
		marginHorizontal: 3, 
		marginBottom: -75,
	},
	tagsList: {
		paddingHorizontal: 20,
		flexDirection: 'row',
		//flexWrap: 'wrap',
		width: width ,
		marginTop: 10,
	},
	collectionList: {
		marginTop: 20,
		marginLeft: 20,
		height: (width/3 *.65) * 2.1,
	},
});

module.exports = Homepage;
