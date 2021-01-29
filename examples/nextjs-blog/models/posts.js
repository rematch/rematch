const POST_TEMPLATE = {
	key: 1,
	title: 'Some post title',
	description: 'Some post description',
}

export const posts = {
	state: {
		posts: [POST_TEMPLATE],
	},
	reducers: {
		setPosts: (state, post) => {
			if (state.posts.length === 0) {
				return {
					...state,
					posts: [POST_TEMPLATE],
				}
			}

			const newkey = state.posts[state.posts.length - 1].key + 1
			return {
				...state,
				posts: [...state.posts, { ...post, key: newkey }],
			}
		},
		removePostById(state, postId) {
			return {
				...state,
				posts: state.posts.filter((x) => x.key !== postId),
			}
		},
	},
	effects: (dispatch) => ({
		duplicatePost() {
			dispatch.posts.setPosts(POST_TEMPLATE)
		},
	}),
}
