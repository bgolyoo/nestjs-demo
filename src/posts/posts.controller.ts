import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import FindOneParams from '../utils/find-one-params';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Put(':id')
  updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
