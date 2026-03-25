import { Controller, Get, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('legal')
export class LegalController {
  constructor(private companiesService: CompaniesService) {}

  @Get('privacy')
  getPrivacyPolicy() {
    return {
      title: 'Gizlilik Politikası',
      content: `
        Fiyat Casusu olarak, kişisel verilerinizin gizliliğini önemsiyoruz.
        Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklar.
        
        Toplanan Veriler:
        - Email ve şifre (kimlik doğrulama için)
        - Şirket bilgileri
        - İzlenen ürün ve rakip verileri
        - Fiyat geçmişi verileri
        
        Verilerin Kullanımı:
        - Hizmet sunumu ve geliştirme
        - Analiz ve raporlama
        - Müşteri desteği
        
        KVKK kapsamında 6698 sayılı Kanun'a uygun hareket ediyoruz.
      `,
      version: '1.0',
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('kvkk')
  getKvkkNotice() {
    return {
      title: 'KVKK Aydınlatma Metni',
      content: `
        6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında,
        kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek isteriz.
        
        Veri Sorumlusu: Fiyat Casusu
        
        İşlenen Veriler:
        - Kimlik verileri (ad, soyad, email)
        - İletişim verileri (telefon, adres)
        - İş verileri (şirket bilgileri)
        
        İşleme Amaçları:
        - Hizmet sunumu
        - Yasal yükümlülükler
        - İletişim
        
        Haklarınız:
        - Bilgi alma
        - Düzeltme
        - Silme
        - İşlemeyi reddetme
        
        Verileriniz, yurt dışına aktarılmayacaktır.
      `,
      version: '1.0',
      updatedAt: new Date().toISOString(),
    };
  }

  @Post('consent')
  @UseGuards(JwtAuthGuard)
  async submitConsent(@Request() req: any, @Body() body: { consent: boolean }) {
    if (body.consent) {
      await this.companiesService.updateKvkkConsent(req.user.companyId, true);
      return { message: 'Rıza başarıyla kaydedildi' };
    }
    return { message: 'Rıza reddedildi' };
  }

  @Delete('data')
  @UseGuards(JwtAuthGuard)
  async requestDataDeletion(@Request() req: any) {
    // In a real application, this would queue a data deletion job
    // that handles GDPR/KVKK right to be forgotten
    return {
      message: 'Veri silme talebi alınmıştır. 30 gün içinde işlenecektir.',
      requestId: `del-${Date.now()}`,
      requestedAt: new Date().toISOString(),
    };
  }
}