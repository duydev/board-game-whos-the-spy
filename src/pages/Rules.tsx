import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Rules = () => {
  const { t } = useTranslation('pages/rules');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('preparation.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('preparation.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            {t('preparation.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('roleAssignment.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('roleAssignment.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
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

      <Card>
        <CardHeader>
          <CardTitle>{t('discussion.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('discussion.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            {t('discussion.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('voting.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('voting.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            {t('voting.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('winConditions.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('winConditions.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>{t('winConditions.civilianWin')}</strong>
            </li>
            <li>
              <strong>{t('winConditions.spyWin')}</strong>
            </li>
          </ul>
          <p className="mt-4">{t('winConditions.continue')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('gameEnd.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('gameEnd.description')}</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            {t('gameEnd.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('tips.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 ml-4">
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
