import { NextFunction, Request, RequestHandler, Response } from 'express';
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
import { Comment, Post } from '../entity';
@controller('/comments')
class CommentController {
	@get('/')
	async getComments(req: Request, res: Response): Promise<Response> {
		try {
			const comments = await getRepository(Comment).find();
			if (comments.length > 0) return res.json(comments);
			return res.json('no comments yet!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@post('/')
	@bodyValidator('comment', 'post')
	async createComment(req: Request, res: Response): Promise<Response> {
		try {
			const { comment, post } = req.body;
			const poster = await getRepository(Post)
				.createQueryBuilder()
				.where('id = :id', { id: post })
				.getOne();
			if (!poster) return res.json('post does not exist');
			const newComment = new Comment();
			newComment.comment = comment;
			newComment.post = post;
			await getRepository(Comment).save(newComment);
			return res.json('comment created!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@put('/:id')
	@bodyValidator('comment')
	async updateComment(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const { comment } = req.body;
			const updatedComment = await getRepository(Comment)
				.createQueryBuilder()
				.update(Comment)
				.set({ comment })
				.where('id = :id', { id })
				.execute();
			if (updatedComment.affected && updatedComment.affected > 0) {
				return res.json('Comment has been updated!');
			}
			return res.json('Comment has not been found');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
	@del('/:id')
	async deleteComment(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const deletedComment = await getRepository(Comment)
				.createQueryBuilder()
				.delete()
				.from(Comment)
				.where('id = :id', { id })
				.execute();
			if (deletedComment.affected && deletedComment.affected > 0) {
				return res.json('Comment has been deleted!');
			}
			return res.json('Comment does not exist!');
		} catch (err) {
			console.log(err);
			return res.json('server error');
		}
	}
}
