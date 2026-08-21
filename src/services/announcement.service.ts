import { NewsService } from './news.service';

export class AnnouncementService {
  static async getAllAnnouncements(): Promise<any[]> {
    return NewsService.getAllNews();
  }

  static async getAnnouncementById(id: string): Promise<any | null> {
    return NewsService.getNewsById(id);
  }

  static async createAnnouncement(data: any): Promise<any> {
    return NewsService.createNews(data);
  }

  static async updateAnnouncement(id: string, data: any): Promise<any> {
    return NewsService.updateNews(id, data);
  }

  static async deleteAnnouncement(id: string): Promise<boolean> {
    return NewsService.deleteNews(id);
  }
}
