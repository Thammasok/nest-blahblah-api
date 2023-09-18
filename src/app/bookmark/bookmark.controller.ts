import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateBookmarkDto, EditBookmarkDto } from 'src/app/bookmark/dto'
import { BookmarkService } from 'src/app/bookmark/bookmark.service'
import { AccessTokenGuard } from 'src/common/guards'
import { GetCurrentAccountId } from 'src/common/decorators'

@UseGuards(AccessTokenGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetCurrentAccountId() accountId: number) {
    return this.bookmarkService.getBookmarks(accountId)
  }

  @Get(':id')
  getBookmarkById(
    @GetCurrentAccountId() accountId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(accountId, bookmarkId)
  }

  @Post()
  createBookmark(
    @GetCurrentAccountId() accountId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(accountId, dto)
  }

  @Patch(':id')
  editBookmarkById(
    @GetCurrentAccountId() accountId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(accountId, bookmarkId, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetCurrentAccountId() accountId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(accountId, bookmarkId)
  }
}
