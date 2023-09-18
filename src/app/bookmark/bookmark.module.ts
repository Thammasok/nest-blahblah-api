import { Module } from '@nestjs/common'
import { BookmarkController } from 'src/app/bookmark/bookmark.controller'
import { BookmarkService } from 'src/app/bookmark/bookmark.service'

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
