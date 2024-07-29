"use strict";
const { Model } = require("sequelize");
const { OTP_EXPIRE_TIME } = require("../config");
const sendOTPEmail = require("../utils/email/sendOTPEmail");
const logger = require("../utils/loggers/appLogger");

module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {}
  }
  OTP.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
       
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      OTP: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OTP",
      tableName: "otps",
      timestamps: true,
      hooks: {
        beforeCreate: async (otp) => {
          try {
            await sendOTPEmail(otp.email, otp.OTP);
            logger.info(`OTP Email Sent successfully!`);
          } catch (err) {
            logger.error(`Error in Sending OTP email: ${err.message}`);
          }
        },

        afterCreate: async (otp) => {
          // Schedule deletion of the OTP record after 5 minutes
          setTimeout(async () => {
            try {
              await otp.destroy();
              logger.info(`OTP record deleted successfully after 5 minutes!`);
            } catch (error) {
              logger.error(`Error in deleting the OTP record: ${err.message}`);
            }
          }, OTP_EXPIRE_TIME);
        },
      },
    }
  );
  return OTP;
};
