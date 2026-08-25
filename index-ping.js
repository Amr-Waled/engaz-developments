const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// مسار ملف الصلاحيات الخاص بجوجل كلاود
const KEY_FILE = path.join(__dirname, 'service-account.json');

// التحقق من وجود الملف قبل البدء
if (!fs.existsSync(KEY_FILE)) {
    console.error('❌ خطأ: لم يتم العثور على ملف service-account.json!');
    console.log('يرجى تحميل المفتاح من Google Cloud وتسميته service-account.json ووضعه في هذا المجلد.');
    process.exit(1);
}

// الروابط التي نريد إجبار جوجل على أرشفتها فوراً
const urlsToPing = [
    'https://amr-waled.github.io/',
    'https://amr-waled.github.io/llms.txt',
    'https://amr-waled.github.io/engaz-developments/',
    'https://amr-waled.github.io/engaz-developments/llms.txt'
];

async function pingGoogle() {
    try {
        // إعداد الاتصال والمصادقة مع جوجل
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/indexing']
        });

        const authClient = await auth.getClient();
        const indexing = google.indexing({
            version: 'v3',
            auth: authClient
        });

        console.log('🚀 جاري إرسال طلبات الأرشفة الفورية لجوجل...');

        for (const url of urlsToPing) {
            const res = await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED' // تعني تحديث أو إنشاء رابط جديد
                }
            });
            console.log(`✅ تم إرسال طلب الأرشفة بنجاح للرابط: ${url}`);
            console.log(`📡 استجابة جوجل: ${res.data.urlNotificationMetadata.latestUpdate.type}`);
            console.log('---');
        }

        console.log('🎉 تم الانتهاء بنجاح! سيقوم جوجل بالزحف للموقع خلال دقائق.');

    } catch (error) {
        console.error('❌ حدث خطأ أثناء الاتصال بجوجل:', error.message);
    }
}

pingGoogle();
