import * as styles from "./profile-content.css";
import { useCallback, useContext } from "react";
import { userProfileContext } from "@renderer/context";
import { useTranslation } from "react-i18next";
import { useFormat } from "@renderer/hooks";
import { MAX_MINUTES_TO_SHOW_IN_PLAYTIME } from "@renderer/constants";
import HydraIcon from "@renderer/assets/icons/hydra.svg?react";

export function UserStatsBox() {
  const { userStats } = useContext(userProfileContext);

  const { t } = useTranslation("user_profile");

  const { numberFormatter } = useFormat();

  const formatPlayTime = useCallback(
    (playTimeInSeconds: number) => {
      const seconds = playTimeInSeconds;
      const minutes = seconds / 60;

      if (minutes < MAX_MINUTES_TO_SHOW_IN_PLAYTIME) {
        return t("amount_minutes", {
          amount: minutes.toFixed(0),
        });
      }

      const hours = minutes / 60;
      return t("amount_hours", { amount: numberFormatter.format(hours) });
    },
    [numberFormatter, t]
  );

  if (!userStats) return null;

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2>{t("stats")}</h2>
      </div>

      <div className={styles.box}>
        <ul className={styles.list}>
          {userStats.achievementsPointsEarnedSum && (
            <li>
              <h3 className={styles.listItemTitle}>{t("achievements")}</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <HydraIcon width={20} height={20} />
                  {userStats.achievementsPointsEarnedSum.value}
                </p>
                <p title={t("ranking_updated_weekly")}>
                  {t("top_percentile", {
                    percentile:
                      userStats.achievementsPointsEarnedSum.topPercentile,
                  })}
                </p>
              </div>
              <p>Unlock count: {userStats.unlockedAchievementSum}</p>
            </li>
          )}

          <li>
            <h3 className={styles.listItemTitle}>{t("games")}</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>
                {t("total_play_time", {
                  amount: formatPlayTime(
                    userStats.totalPlayTimeInSeconds.value
                  ),
                })}
              </p>
              <p title={t("ranking_updated_weekly")}>
                {t("top_percentile", {
                  percentile: userStats.totalPlayTimeInSeconds.topPercentile,
                })}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
