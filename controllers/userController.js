// userController.js
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import createError from '../utils/createError.js';

export const getUsers = async (req, res, next) => {
  if (!req.isAdmin) return next(createError(403, "User can't view users!"));

  const query = req.query.new;

  try {
    const users = query
      ? await userModel.find().sort({ _id: -1 }).limit(5)
      : await userModel.find();

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const deleteUsers = async (req, res, next) => {
  if (!req.isAdmin) return next(createError(403, "User can't view users!"));

  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const monthlyUsers = await userModel.aggregate([
      {
        $project: {
          month: { $month: { $toDate: '$createdAt' } },
        },
      },
      {
        $group: {
          _id: '$month',
          userCount: { $sum: 1 },
        },
      },
    ]);

    console.log(monthlyUsers);
    res.json(monthlyUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


