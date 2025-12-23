import { useTranslation } from 'react-i18next';
import { BookOpen, Users, MessageSquare, CheckSquare, Target, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Rules = () => {
  const { t } = useTranslation('pages/rules');

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Users className="h-6 w-6 text-primary" />
            {t('preparation.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('preparation.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            {t('preparation.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Target className="h-6 w-6 text-primary" />
            {t('roleAssignment.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('roleAssignment.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            <li>{t('roleAssignment.items', { returnObjects: true })[0]}</li>
            <li>
              {t('roleAssignment.items', { returnObjects: true })[1]}
              <ul className="list-circle list-inside ml-6 mt-2">
                <li>
                  <strong>{t('roleAssignment.civilianRole')}</strong>
                </li>
                <li>
                  <strong>{t('roleAssignment.spyRole')}</strong>
                </li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            {t('discussion.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('discussion.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            {t('discussion.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <CheckSquare className="h-6 w-6 text-primary" />
            {t('voting.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('voting.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            {t('voting.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Target className="h-6 w-6 text-primary" />
            {t('winConditions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('winConditions.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            <li>
              <strong>{t('winConditions.civilianWin')}</strong>
            </li>
            <li>
              <strong>{t('winConditions.spyWin')}</strong>
            </li>
          </ul>
          <p className="mt-6 text-base lg:text-lg">{t('winConditions.continue')}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Info className="h-6 w-6 text-primary" />
            {t('gameEnd.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base lg:text-lg">{t('gameEnd.description')}</p>
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            {t('gameEnd.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Info className="h-6 w-6 text-primary" />
            {t('tips.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc list-inside space-y-3 ml-4 text-base lg:text-lg">
            <li>
              <strong>{t('tips.civilianTips')}</strong>
            </li>
            <li>
              <strong>{t('tips.spyTips')}</strong>
            </li>
            {t('tips.generalTips', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
