import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
	get,
	post,
	put,
	del,
	bodyValidator,
	controller,
	useMiddleware,
} from '../Decorators';
import { Post } from '../entity';
@controller('/posts')
class PostController {
	@get('/')
	async getPosts(req: Request, res: Response): Promise<Response> {
		try {
			const posts = await getRepository(Post).find({ relations: ['comments'] });
			if (posts.length > 0) {
				return res.json(posts);
			}
			return res.json('no posts yet!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@get('/:id')
	async getOnePost(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const post = await getRepository(Post).findOne(id,{relations: ['comments']})
			if (post) {
				return res.json(post);
			}
			return res.json('post does not exist!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@post('/')
	@bodyValidator('content')
	async createPost(req: Request, res: Response): Promise<Response> {
		try {
			const { content } = req.body;
			const newPost = new Post();
			newPost.content = content;
			await getRepository(Post).save(newPost);
			return res.json('Post created!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@put('/:id')
	@bodyValidator('content')
	async updatePost(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const { content } = req.body;
			const updatedPost = await getRepository(Post)
				.createQueryBuilder()
				.update(Post)
				.set({
					content,
				})
				.where('id = :id', { id })
				.execute();
			if (updatedPost.affected && updatedPost.affected > 0) {
				return res.json('Post has been updated!');
			}
			return res.json('post has not been found');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@del('/:id')
	async deletePost(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const deletedPost = await getRepository(Post)
				.createQueryBuilder()
				.delete()
				.from(Post)
				.where('id = :id', { id })
				.execute();
			if (deletedPost.affected && deletedPost.affected > 0) {
				return res.json('Post has been deleted!');
			}
			return res.json('Post does not exist!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
}
